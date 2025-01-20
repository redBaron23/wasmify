use image::ImageFormat;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Serialize, Deserialize)]
pub struct ConversionOptions {
    format: String,
    quality: u32,
    preserve_audio: Option<bool>,
    resolution: Option<String>,
    fps: Option<u32>,
}

#[wasm_bindgen(start)]
pub fn start() {
    console_error_panic_hook::set_once();
}

#[wasm_bindgen]
pub struct MediaConverter {
    options: ConversionOptions,
    progress_callback: Option<js_sys::Function>, // Callback para reportar progreso a JS
}

#[wasm_bindgen]
impl MediaConverter {
    #[wasm_bindgen(constructor)]
    pub fn new(options: JsValue) -> Result<MediaConverter, JsValue> {
        let options: ConversionOptions = serde_wasm_bindgen::from_value(options)?;

        Ok(MediaConverter {
            options,
            progress_callback: None,
        })
    }

    #[wasm_bindgen]
    pub fn set_progress_callback(&mut self, callback: js_sys::Function) {
        self.progress_callback = Some(callback);
    }

    fn update_progress(&self, progress: f64) {
        if let Some(callback) = &self.progress_callback {
            let this = JsValue::null();
            let _ = callback.call1(&this, &JsValue::from(progress));
        }
    }

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
                self.update_progress(50.0);

                let mut output = Vec::new();
                {
                    let mut encoder = image::codecs::gif::GifEncoder::new(&mut output);
                    self.update_progress(70.0);

                    let frame = image::Frame::new(rgb_img);
                    encoder
                        .encode_frame(frame)
                        .map_err(|e| JsValue::from_str(&format!("Error encoding GIF: {}", e)))?;

                    self.update_progress(90.0);
                }
                self.update_progress(100.0);
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
}
