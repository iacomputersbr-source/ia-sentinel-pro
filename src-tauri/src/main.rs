#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::command;
use std::process::Command;
use std::collections::HashSet;

#[command]
fn get_hwid() -> String {
    let output = Command::new("powershell.exe")
       .args(&["-Command", "(Get-WmiObject Win32_ComputerSystemProduct).UUID"])
       .output();
    match output {
        Ok(o) => String::from_utf8_lossy(&o.stdout).trim().to_string(),
        Err(_) => "UNKNOWN-HWID".to_string()
    }
}

#[command]
fn validate_license_25(key: String) -> bool {
    let cleaned = key.replace("-", "").to_uppercase();
    if cleaned.len()!= 25 { return false; }
    let allowed = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    if!cleaned.chars().all(|c| allowed.contains(c)) { return false; }
    let unique: HashSet<char> = cleaned.chars().collect();
    if unique.len() < 8 { return false; }
    true
}

#[command]
fn activate_product(key: String, hwid: String) -> String {
    if!validate_license_25(key.clone()) {
        return r#"{"valid": false}"#.to_string();
    }
    format!(r#"{{"valid": true, "key": "{}", "hwid": "{}"}}"#, key, hwid)
}

#[command]
fn scan_hardware(_lang: String) -> String {
    r#"{"hostname": "PC-CLIENTE", "cpu": "Intel", "ram_gb": 8, "disks": []}"#.to_string()
}

fn main() {
    tauri::Builder::default()
       .invoke_handler(tauri::generate_handler![get_hwid, validate_license_25, activate_product, scan_hardware])
       .run(tauri::generate_context!())
       .expect("error while running tauri application");
  }
