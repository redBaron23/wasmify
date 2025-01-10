// Importamos las bibliotecas necesarias
use image::{DynamicImage, ImageFormat};
use serde::{Deserialize, Serialize}; // Para convertir entre formatos Rust y JS
use wasm_bindgen::prelude::*; // Para interactuar con JavaScript
use web_sys::console; // Para logging en la consola del navegador // Para manipulación de imágenes

// Este es nuestro struct (similar a una interface en TS) para las opciones de conversión
// Derive automáticamente implementa la serialización/deserialización
#[derive(Serialize, Deserialize)]
pub struct ConversionOptions {
    format: String,               // Formato de salida (webp, png, etc)
    quality: u32,                 // Calidad de la conversión (0-100)
    preserve_audio: Option<bool>, // Option significa que es opcional
    resolution: Option<String>,
    fps: Option<u32>,
}

// Esta función es para errores más descriptivos en el navegador
#[wasm_bindgen(start)]
pub fn start() {
    console_error_panic_hook::set_once();
}

// La estructura principal que maneja la conversión
#[wasm_bindgen]
pub struct MediaConverter {
    options: ConversionOptions,
    progress_callback: Option<js_sys::Function>, // Callback para reportar progreso a JS
}

// Implementación de los métodos del MediaConverter
#[wasm_bindgen]
impl MediaConverter {
    // Constructor - se llama con 'new MediaConverter(options)' desde JS
    #[wasm_bindgen(constructor)]
    pub fn new(options: JsValue) -> Result<MediaConverter, JsValue> {
        // Convertimos las opciones de JS a nuestro tipo Rust
        let options: ConversionOptions = serde_wasm_bindgen::from_value(options)?;

        Ok(MediaConverter {
            options,
            progress_callback: None,
        })
    }

    // Método para establecer el callback de progreso
    #[wasm_bindgen]
    pub fn set_progress_callback(&mut self, callback: js_sys::Function) {
        self.progress_callback = Some(callback);
    }

    // Método interno para actualizar el progreso
    fn update_progress(&self, progress: f64) {
        if let Some(callback) = &self.progress_callback {
            let this = JsValue::null();
            let _ = callback.call1(&this, &JsValue::from(progress));
        }
    }

    // Método para convertir imágenes
    #[wasm_bindgen]
    pub fn convert_image(&mut self, input_data: Vec<u8>) -> Result<Vec<u8>, JsValue> {
        self.update_progress(0.0);

        let img = image::load_from_memory(&input_data)
            .map_err(|e| JsValue::from_str(&format!("Error loading image: {}", e)))?;

        self.update_progress(30.0);

        let format = match self.options.format.as_str() {
            "png" => ImageFormat::Png,
            "jpg" | "jpeg" => ImageFormat::Jpeg,
            "webp" => ImageFormat::WebP,
            "gif" => {
                let rgb_img = img.into_rgba8();
                self.update_progress(50.0); // Actualización después de la conversión a RGBA8

                let mut output = Vec::new();
                {
                    let mut encoder = image::codecs::gif::GifEncoder::new(&mut output);
                    self.update_progress(70.0); // Actualización después de crear el encoder

                    let frame = image::Frame::new(rgb_img);
                    encoder
                        .encode_frame(frame)
                        .map_err(|e| JsValue::from_str(&format!("Error encoding GIF: {}", e)))?;

                    self.update_progress(90.0); // Actualización después de codificar el frame
                }
                self.update_progress(100.0); // Actualización final
                return Ok(output);
            }
            _ => return Err(JsValue::from_str("Unsupported format")),
        };

        self.update_progress(60.0);

        let mut output = Vec::new();
        img.write_to(&mut std::io::Cursor::new(&mut output), format)
            .map_err(|e| JsValue::from_str(&format!("Error writing image: {}", e)))?;

        self.update_progress(100.0);

        Ok(output)
    }

    // Método para convertir videos (implementación básica por ahora)
    #[wasm_bindgen]
    pub fn convert_video(&mut self, input_data: Vec<u8>) -> Result<Vec<u8>, JsValue> {
        // Por ahora solo devolvemos error ya que necesitamos implementar la conversión de video
        Err(JsValue::from_str("Video conversion not implemented yet"))
    }
}

// Tests unitarios
#[cfg(test)]
mod tests {
    use super::*;

    // Test existente
    #[test]
    fn test_conversion_options_serialization() {
        let options = ConversionOptions {
            format: "webp".to_string(),
            quality: 80,
            preserve_audio: Some(true),
            resolution: Some("1080p".to_string()),
            fps: Some(30),
        };

        let js_value = serde_wasm_bindgen::to_value(&options).unwrap();
        let deserialized: ConversionOptions = serde_wasm_bindgen::from_value(js_value).unwrap();

        assert_eq!(options.format, deserialized.format);
        assert_eq!(options.quality, deserialized.quality);
    }

    // Test para conversión básica de imagen
    #[test]
    fn test_image_conversion() {
        // Crear una imagen de prueba simple (1x1 pixel rojo)
        let test_image = vec![255, 0, 0, 255]; // RGBA

        // Opciones para convertir a diferentes formatos
        let formats = ["png", "jpg", "webp", "gif"];

        for format in formats {
            let options = ConversionOptions {
                format: format.to_string(),
                quality: 90,
                preserve_audio: None,
                resolution: None,
                fps: None,
            };

            let js_options = serde_wasm_bindgen::to_value(&options).unwrap();
            let mut converter = MediaConverter::new(js_options).unwrap();

            // Intentar la conversión
            let result = converter.convert_image(test_image.clone());
            assert!(result.is_ok(), "La conversión a {} falló", format);

            // Verificar que el resultado no está vacío
            let output = result.unwrap();
            assert!(!output.is_empty(), "El output para {} está vacío", format);
        }
    }
    // Test para errores
    #[test]
    fn test_invalid_format() {
        let options = ConversionOptions {
            format: "invalid".to_string(),
            quality: 90,
            preserve_audio: None,
            resolution: None,
            fps: None,
        };

        let js_options = serde_wasm_bindgen::to_value(&options).unwrap();
        let mut converter = MediaConverter::new(js_options).unwrap();

        let test_image = vec![255, 0, 0, 255];
        let result = converter.convert_image(test_image);
        assert!(result.is_err());
    }
}
