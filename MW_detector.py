
import hashlib
import os
import tkinter as tk
from tkinter import filedialog, messagebox, scrolledtext, ttk

malware_classification = {
    "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8": "Ransomware",
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855": "Trojan",
    "8754c2a98e3b9c86aa49d4a35b8835e5fc6d5e6f53d6bce44a7f8db9c524de7a": "Virus",
    "3dc3c3f1bce75e029b1c7a8db9a20dfb2c6f68c925b1898db0d49f7a1d0520a6": "Spyware",
    "d301f9c47a8dd8331c4597feefcb056d08e3a3b4c4f4d03f9c1436a1a5f5b6b5": "Adware",
    "1e8a9f5127d527fb9c97d7fd8be2b883cc7f75e20e437d7b19db69b42c42220c": "Worm"
}

def calculate_hashes(file_path):
    if not os.path.exists(file_path):
        return None
    try:
        hasher_md5 = hashlib.md5()
        hasher_sha1 = hashlib.sha1()
        hasher_sha256 = hashlib.sha256()
        with open(file_path, 'rb') as file:
            buf = file.read(65536)
            while len(buf) > 0:
                hasher_md5.update(buf)
                hasher_sha1.update(buf)
                hasher_sha256.update(buf)
                buf = file.read(65536)
        return hasher_md5.hexdigest(), hasher_sha1.hexdigest(), hasher_sha256.hexdigest()
    except Exception:
        return None

def classify_malware(file_hashes):
    if not file_hashes:
        return "Safe"
    for hash_value in file_hashes:
        if hash_value in malware_classification:
            return malware_classification[hash_value]
    return "Safe"

def scan_folder_gui(folder_path, text_widget, progressbar, status_label):
    if not os.path.exists(folder_path):
        messagebox.showerror("Error", f"The folder '{folder_path}' does not exist!")
        return
    files = [f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]
    total_files = len(files)
    if total_files == 0:
        text_widget.config(state=tk.NORMAL)
        text_widget.delete(1.0, tk.END)
        text_widget.insert(tk.END, "The folder is empty.\n")
        text_widget.config(state=tk.DISABLED)
        status_label.config(text="Ready")
        progressbar['value'] = 0
        return

    text_widget.config(state=tk.NORMAL)
    text_widget.delete(1.0, tk.END)
    status_label.config(text=f"Scanning {total_files} files...")
    progressbar['maximum'] = total_files
    progressbar['value'] = 0

    for i, file in enumerate(files, 1):
        file_path = os.path.join(folder_path, file)
        file_hashes = calculate_hashes(file_path)
        malware_type = classify_malware(file_hashes)
        line = f"{file} --> {malware_type}\n"

        if malware_type == "Safe":
            text_widget.insert(tk.END, line, "safe")
        else:
            text_widget.insert(tk.END, line, "malware")

        progressbar['value'] = i
        status_label.config(text=f"Scanning file {i} of {total_files}...")
        root.update_idletasks()

    status_label.config(text="Scan complete!")
    text_widget.config(state=tk.DISABLED)

def browse_and_scan():
    folder_selected = filedialog.askdirectory()
    if folder_selected:
        scan_folder_gui(folder_selected, output_text, progress_bar, status_label)

def on_enter(e):
    btn_browse.config(bg="#3498db")

def on_leave(e):
    btn_browse.config(bg="#2980b9")

root = tk.Tk()
root.title("🛡️ Enhanced Malware Scanner")
root.geometry("700x500")
root.configure(bg="#e6f0ff")


title_label = tk.Label(root, text="🛡️ Malware Scanner", font=("Segoe UI", 28, "bold"), bg="#e6f0ff", fg="#1a237e")
title_label.pack(pady=(25,10))

status_label = tk.Label(root, text="Ready", font=("Segoe UI", 12), bg="#e6f0ff", fg="#555555")
status_label.pack()

btn_browse = tk.Button(root, text="Select Folder and Scan", font=("Segoe UI", 16, "bold"),
                       bg="#2980b9", fg="white", activebackground="#276e9e",
                       activeforeground="white", relief="flat", padx=25, pady=12,
                       command=browse_and_scan)
btn_browse.pack(pady=20)

btn_browse.bind("<Enter>", on_enter)
btn_browse.bind("<Leave>", on_leave)

progress_bar = ttk.Progressbar(root, orient="horizontal", length=600, mode="determinate")
progress_bar.pack(pady=10)

output_text = scrolledtext.ScrolledText(root, width=80, height=18, font=("Consolas", 11),
                                        bg="white", fg="#34495e", relief="flat", borderwidth=2)
output_text.pack(padx=20, pady=10)

output_text.tag_configure("safe", foreground="#27ae60")    
output_text.tag_configure("malware", foreground="#c0392b") 

output_text.config(state=tk.DISABLED)

root.mainloop()
