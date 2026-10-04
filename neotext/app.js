// SPDX-License-Identifier: GPL-3.0-or-later
//
// NeoText - Lightweight, Native Windows Markdown & Document Workspace
// Copyright (C) 2026 The NeoText Project (atukay) <https://github.com/atukay/NeoText>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

// NeoText - High-Performance Modern Text and Markdown Workspace Core
(function() {
  'use strict';

  function getStored(key, defVal) {
    if (defVal === undefined) defVal = null;
    var v = localStorage.getItem('neotext_' + key);
    if (v !== null && v !== undefined) return v;
    v = localStorage.getItem('neomd_' + key);
    return (v !== null && v !== undefined) ? v : defVal;
  }
  function setStored(key, val) {
    try {
      localStorage.setItem('neotext_' + key, val);
    } catch(e) {}
  }

  let savedWidth = getStored('width');
  if (savedWidth === '740px' || savedWidth === '780px' || !savedWidth) savedWidth = '760px';
  else if (savedWidth === '580px' || savedWidth === '620px') savedWidth = '600px';
  else if (savedWidth === '960px' || savedWidth === '1020px') savedWidth = '980px';
  else if (savedWidth === '1200px' || savedWidth === '1280px') savedWidth = '1240px';

  const urlParams = new URLSearchParams(window.location.search);
  const paramTheme = urlParams.get('theme');
  const paramLang = urlParams.get('lang');

  const savedTheme = paramTheme || getStored('theme');
  const initialTheme = (savedTheme === 'light') ? 'light' : (savedTheme === 'oled' ? 'oled' : 'dark');

  function detectSystemLanguage() {
    try {
      const raw = (navigator.language || navigator.userLanguage || '').toLowerCase().trim();
      if (!raw) return 'en';
      if (raw === 'zh-tw' || raw === 'zh-hk' || raw === 'zh-mo') return 'zh-TW';
      if (raw.startsWith('zh')) return 'zh';
      const code = raw.split('-')[0];
      const supported = ['tr', 'en', 'de', 'es', 'fr', 'it', 'pt', 'nl', 'pl', 'ru', 'uk', 'ar', 'hi', 'ja', 'ko', 'id', 'vi', 'az'];
      if (supported.indexOf(code) !== -1) return code;
    } catch(e) {}
    return 'en';
  }

  const savedLang = paramLang || getStored('lang') || detectSystemLanguage();

  // I18N Translation Dictionary (20 Languages: AZ, ID, DE, EN, ES, FR, IT, NL, PL, PT, VI, TR, RU, UK, AR, HI, JA, ZH, ZH-TW, KO)
  const I18N = {
    "tr": {
      tab_files: "Dosya",
      tab_files_title: "Klasör / Dosyalar",
      tab_outline: "İçerik",
      tab_outline_title: "İçindekiler ve İstatistikler",
      tab_search: "Ara",
      tab_search_title: "Belge İçi Arama (Ctrl+F)",
      no_folder_open: "Klasör Açılmadı",
      refresh_folder_title: "Yenile (F5)",
      open_file_btn: "Dosya Aç",
      open_folder_btn: "Klasör Seç",
      folder_tree_empty_hint: "Notlarınızı ve dosyalarınızı ağaç olarak görmek için bir klasör seçin.",
      new_tab_title: "Yeni Belge (Ctrl+N, Ctrl+T)",
      close_tab_title: "Kapat (Ctrl+W)",
      untitled_doc: "Yeni Belge",
      stat_title: "Metin İstatistikleri",
      stat_words: "Kelime",
      stat_chars: "Karakter",
      stat_reading_time: "Okuma Süresi",
      stat_time_unit: "dk",
      stat_path: "Dosya Yolu",
      search_placeholder: "Belgede ara (Ctrl+F)...",
      search_prev_title: "Önceki Eşleşme (Shift+Enter)",
      search_next_title: "Sonraki Eşleşme (Enter)",
      search_no_match: "Eşleşme bulunamadı",
      search_matches: "eşleşme",
      toc_empty: "Belgede herhangi bir başlık bulunamadı.",
      width_mode: "Okuma Genişliği / Sayfa Düzeni",
      width_narrow: "Dar",
      width_readable: "Okunabilir",
      width_readable_title: "Göz yorgunluğunu önleyen ideal satır uzunluğu (~65–75 karakter)",
      width_comfortable: "Rahat",
      width_wide: "Geniş",
      width_full: "Tam",
      theme_toggle_title: "Tema Değiştir (Koyu / OLED / Açık) (Alt+Shift+T)",
      sidebar_toggle_title: "Kenar Çubuğunu Aç/Kapat (Alt+Shift+B)",
      menu_more_title: "Seçenekler",
      menu_lang: "Dil",
      menu_scale: "Arayüz Ölçeği",
      menu_scale_dec: "Arayüzü Küçült",
      menu_scale_inc: "Arayüzü Büyüt",
      menu_font: "Yazı Boyutu",
      menu_font_dec: "Yazı Boyutunu Küçült",
      menu_font_inc: "Yazı Boyutunu Büyüt",
      menu_save_as: "Farklı Kaydet...",
      menu_copy_html: "HTML Olarak Kopyala",
      menu_print: "Yazdır / PDF Kaydet...",
      app_desc: "Markdown & Metin Görüntüleyici",
      copy_code_btn: "Kopyala",
      copied_text: "Kopyalandı",
      copy_html_alert: "Biçimlendirilmiş HTML panoya kopyalandı!",
      edit_mode: "Düzenleme Modu (Ctrl+E)",
      save_btn: "Kaydet",
      save_btn_title: "Değişiklikleri Kaydet (Ctrl+S)",
      save_confirm_prompt: "Belgedeki değişiklikler kaydedilsin mi?",
      btn_yes: "Kaydet",
      btn_no: "Kaydetme",
      btn_cancel: "İptal",
      saved_toast: "Değişiklikler başarıyla kaydedildi!",
      doc_up_to_date: "Belge zaten güncel.",
      tool_h1: "Başlık 1 (Ctrl+1)",
      tool_h2: "Başlık 2 (Ctrl+2)",
      tool_bold: "Kalın (Ctrl+B)",
      tool_italic: "İtalik (Ctrl+I)",
      tool_ul: "Madde İşaretli Liste",
      tool_bullet_dash: "Tire",
      tool_bullet_dot: "Nokta",
      tool_bullet_numbered: "Numaralı",
      tool_ol: "Numaralı Liste",
      tool_quote: "Alıntı / Girinti",
      tool_code: "Kod Bloğu",
      tool_raw: "Ham Metin Editörü",
      menu_convert_txt: "TXT'ye Dönüştür...",
      menu_convert_md: "MD'ye Dönüştür...",
      convert_md_txt_warn: "TXT formatına geçerken Markdown biçimlendirme kaybı olabilir. Belgeyi nasıl kaydetmek istersiniz?",
      convert_rendered_opt: "Biçimlendirilmiş Metin",
      convert_raw_opt: "Ham Kod",
      convert_success_toast: "Belge başarıyla dönüştürüldü!",
      empty_title: "Başlarken",
      empty_desc: "Çalışmaya başlamak için yeni bir belge oluşturun veya var olan bir dosyayı açın.",
      empty_btn_new: "Yeni Belge (Ctrl+N)",
      empty_btn_open: "Dosya Aç...",
      empty_hint: "💡 İpucu: Bir dosyayı buraya sürükleyip bırakabilir veya sol menüdeki klasör ağacından seçebilirsiniz.",
      tabs_dropdown_title: "Tüm Açık Sekmeler",
      tabs_search_placeholder: "Açık sekmeleri ara...",
      external_mode_tab: "Dış Dosyalar: Yeni sekme olarak açılır (Yeni pencere için tıklayın)",
      external_mode_window: "Dış Dosyalar: Yeni pencerede açılır (Yeni sekme için tıklayın)",
      external_mode_menu_tab: "Dış Dosyalar: Yeni Sekme",
      external_mode_menu_win: "Dış Dosyalar: Yeni Pencere",
      external_mode_badge_tab: "Yeni Sekme",
      external_mode_badge_win: "Yeni Pencere",
      menu_external_mode: "Dış Dosyalar",
      menu_open_folder: "📁 Klasör / Çalışma Alanı Aç...",
      tabs_scroll_left_title: "Sola Kaydır",
      tabs_scroll_right_title: "Sağa Kaydır",
      github_link_title: "GitHub Deposu",
      app_rate: "Oyla",
      rate_link_title: "Microsoft Store'da Oyla",
      app_rated_thanks: "Oyladığınız için teşekkürler!",
      toast_image_inserted: "Görsel eklendi: ",
      toast_image_file: "Görsel dosyası: ",
      toast_image_saved: "Görsel kaydedildi: "
    },
    "en": {
      tab_files: "Files",
      tab_files_title: "Workspace / Files",
      tab_outline: "Outline",
      tab_outline_title: "Table of Contents & Stats",
      tab_search: "Search",
      tab_search_title: "Find in Document (Ctrl+F)",
      no_folder_open: "No Folder Open",
      refresh_folder_title: "Refresh (F5)",
      open_file_btn: "Open File",
      open_folder_btn: "Select Folder",
      folder_tree_empty_hint: "Select a folder to view your notes and files as a tree.",
      new_tab_title: "New Document (Ctrl+N, Ctrl+T)",
      close_tab_title: "Close (Ctrl+W)",
      untitled_doc: "Untitled",
      stat_title: "Document Statistics",
      stat_words: "Words",
      stat_chars: "Characters",
      stat_reading_time: "Reading Time",
      stat_time_unit: "min",
      stat_path: "File Location",
      search_placeholder: "Find in document (Ctrl+F)...",
      search_prev_title: "Previous Match (Shift+Enter)",
      search_next_title: "Next Match (Enter)",
      search_no_match: "No matches found",
      search_matches: "matches",
      toc_empty: "No headings found in document.",
      width_mode: "Reading Width / Layout",
      width_narrow: "Compact",
      width_readable: "Readable",
      width_readable_title: "Optimal line length for reading (~65–75 characters)",
      width_comfortable: "Relaxed",
      width_wide: "Wide",
      width_full: "Full",
      theme_toggle_title: "Toggle Theme (Dark / OLED / Light) (Alt+Shift+T)",
      sidebar_toggle_title: "Toggle Sidebar (Alt+Shift+B)",
      menu_more_title: "More Options",
      menu_lang: "Language",
      menu_scale: "UI Scale",
      menu_scale_dec: "Zoom Out UI",
      menu_scale_inc: "Zoom In UI",
      menu_font: "Text Size",
      menu_font_dec: "Decrease Text Size",
      menu_font_inc: "Increase Text Size",
      menu_save_as: "Save As...",
      menu_copy_html: "Copy as Formatted HTML",
      menu_print: "Print / Export to PDF...",
      app_desc: "Markdown & Text Viewer",
      copy_code_btn: "Copy",
      copied_text: "Copied!",
      copy_html_alert: "Formatted HTML copied to clipboard!",
      edit_mode: "Edit Mode (Ctrl+E)",
      save_btn: "Save",
      save_btn_title: "Save Changes (Ctrl+S)",
      save_confirm_prompt: "Do you want to save changes to this document?",
      btn_yes: "Save",
      btn_no: "Don't Save",
      btn_cancel: "Cancel",
      saved_toast: "Changes saved successfully!",
      doc_up_to_date: "Document is already up to date.",
      tool_h1: "Heading 1 (Ctrl+1)",
      tool_h2: "Heading 2 (Ctrl+2)",
      tool_bold: "Bold (Ctrl+B)",
      tool_italic: "Italic (Ctrl+I)",
      tool_ul: "Bulleted List",
      tool_bullet_dash: "Dash",
      tool_bullet_dot: "Bullet",
      tool_bullet_numbered: "Numbered",
      tool_ol: "Numbered List",
      tool_quote: "Quote / Indentation",
      tool_code: "Code Block",
      tool_raw: "Raw Markdown Editor",
      menu_convert_txt: "Convert to TXT...",
      menu_convert_md: "Convert to MD...",
      convert_md_txt_warn: "Formatting may be lost when switching to plain TXT. How would you like to save this file?",
      convert_rendered_opt: "Formatted Text",
      convert_raw_opt: "Raw Markdown",
      convert_success_toast: "Document converted successfully!",
      empty_title: "Getting Started",
      empty_desc: "Create a new document or open an existing file to get started.",
      empty_btn_new: "New Document (Ctrl+N)",
      empty_btn_open: "Open File...",
      empty_hint: "💡 Tip: You can drag and drop a file here or select one from the workspace tree.",
      tabs_dropdown_title: "All Open Tabs",
      tabs_search_placeholder: "Search open tabs...",
      external_mode_tab: "External Files: Opens as a new tab (Click for New Window)",
      external_mode_window: "External Files: Opens in a new window (Click for New Tab)",
      external_mode_menu_tab: "External Files: New Tab",
      external_mode_menu_win: "External Files: New Window",
      external_mode_badge_tab: "New Tab",
      external_mode_badge_win: "New Window",
      menu_external_mode: "External Files",
      menu_open_folder: "📁 Open Folder / Workspace...",
      tabs_scroll_left_title: "Scroll Left",
      tabs_scroll_right_title: "Scroll Right",
      github_link_title: "GitHub Repository",
      app_rate: "Rate",
      rate_link_title: "Rate on Microsoft Store",
      app_rated_thanks: "Thanks for rating!",
      toast_image_inserted: "Image inserted: ",
      toast_image_file: "Image file: ",
      toast_image_saved: "Image saved: "
    },
    "de": {
      tab_files: "Dateien",
      tab_files_title: "Arbeitsbereich / Dateien",
      tab_outline: "Gliederung",
      tab_outline_title: "Inhaltsverzeichnis & Statistiken",
      tab_search: "Suchen",
      tab_search_title: "Im Dokument suchen (Strg+F)",
      no_folder_open: "Kein Ordner geöffnet",
      refresh_folder_title: "Aktualisieren (F5)",
      open_file_btn: "Datei öffnen",
      open_folder_btn: "Ordner wählen",
      folder_tree_empty_hint: "Wählen Sie einen Ordner aus, um Dateien als Struktur anzuzeigen.",
      new_tab_title: "Neues Dokument (Strg+N, Strg+T)",
      close_tab_title: "Schließen (Strg+W)",
      untitled_doc: "Unbenannt",
      stat_title: "Dokumentstatistiken",
      stat_words: "Wörter",
      stat_chars: "Zeichen",
      stat_reading_time: "Lesezeit",
      stat_time_unit: "Min.",
      stat_path: "Dateipfad",
      search_placeholder: "Im Dokument suchen (Strg+F)...",
      search_prev_title: "Vorheriger Treffer (Umschalt+Eingabe)",
      search_next_title: "Nächster Treffer (Eingabe)",
      search_no_match: "Keine Treffer gefunden",
      search_matches: "Treffer",
      toc_empty: "Keine Überschriften im Dokument gefunden.",
      width_mode: "Lesebreite / Layout",
      width_narrow: "Kompakt",
      width_readable: "Lesbar",
      width_readable_title: "Optimale Zeilenlänge zum Lesen (~65–75 Zeichen)",
      width_comfortable: "Bequem",
      width_wide: "Breit",
      width_full: "Vollbild",
      theme_toggle_title: "Design wechseln (Dunkel / OLED / Hell) (Alt+Umschalt+T)",
      sidebar_toggle_title: "Seitenleiste ein-/ausblenden (Alt+Umschalt+B)",
      menu_more_title: "Optionen",
      menu_lang: "Sprache",
      menu_scale: "UI-Skalierung",
      menu_scale_dec: "Oberfläche verkleinern",
      menu_scale_inc: "Oberfläche vergrößern",
      menu_font: "Schriftgröße",
      menu_font_dec: "Schrift verkleinern",
      menu_font_inc: "Schrift vergrößern",
      menu_save_as: "Speichern unter...",
      menu_copy_html: "Als formatiertes HTML kopieren",
      menu_print: "Drucken / Als PDF speichern...",
      app_desc: "Markdown- & Textbetrachter",
      copy_code_btn: "Kopieren",
      copied_text: "Kopiert!",
      copy_html_alert: "Formatiertes HTML in die Zwischenablage kopiert!",
      edit_mode: "Bearbeitungsmodus (Strg+E)",
      save_btn: "Speichern",
      save_btn_title: "Änderungen speichern (Strg+S)",
      save_confirm_prompt: "Möchten Sie die Änderungen an diesem Dokument speichern?",
      btn_yes: "Speichern",
      btn_no: "Nicht speichern",
      btn_cancel: "Abbrechen",
      saved_toast: "Änderungen erfolgreich gespeichert!",
      doc_up_to_date: "Das Dokument ist bereits aktuell.",
      tool_h1: "Überschrift 1 (Strg+1)",
      tool_h2: "Überschrift 2 (Strg+2)",
      tool_bold: "Fett (Strg+B)",
      tool_italic: "Kursiv (Strg+I)",
      tool_ul: "Aufzählungsliste",
      tool_bullet_dash: "Gedankenstrich",
      tool_bullet_dot: "Punkt",
      tool_bullet_numbered: "Nummeriert",
      tool_ol: "Nummerierte Liste",
      tool_quote: "Zitat / Einzug",
      tool_code: "Codeblock",
      tool_raw: "Markdown-Quelltexteditor",
      menu_convert_txt: "In TXT konvertieren...",
      menu_convert_md: "In MD konvertieren...",
      convert_md_txt_warn: "Beim Wechsel zu reinem Text können Formatierungen verloren gehen. Wie möchten Sie speichern?",
      convert_rendered_opt: "Formatierter Text",
      convert_raw_opt: "Markdown-Quellcode",
      convert_success_toast: "Dokument erfolgreich konvertiert!",
      empty_title: "Erste Schritte",
      empty_desc: "Erstellen Sie ein neues Dokument oder öffnen Sie eine Datei, um zu beginnen.",
      empty_btn_new: "Neues Dokument (Strg+N)",
      empty_btn_open: "Datei öffnen...",
      empty_hint: "💡 Tipp: Ziehen Sie eine Datei hierher oder wählen Sie eine aus der Ordnerstruktur.",
      tabs_dropdown_title: "Alle geöffneten Tabs",
      tabs_search_placeholder: "Geöffnete Tabs durchsuchen...",
      external_mode_tab: "Externe Dateien: Werden als neuer Tab geöffnet (Klicken für Neues Fenster)",
      external_mode_window: "Externe Dateien: Werden im neuen Fenster geöffnet (Klicken für Neuer Tab)",
      external_mode_menu_tab: "Externe Dateien: Neuer Tab",
      external_mode_menu_win: "Externe Dateien: Neues Fenster",
      external_mode_badge_tab: "Neuer Tab",
      external_mode_badge_win: "Neues Fenster",
      menu_external_mode: "Externe Dateien",
      menu_open_folder: "📁 Ordner / Arbeitsbereich öffnen...",
      tabs_scroll_left_title: "Nach links scrollen",
      tabs_scroll_right_title: "Nach rechts scrollen",
      github_link_title: "GitHub-Repository",
      app_rate: "Bewerten",
      rate_link_title: "Im Microsoft Store bewerten",
      app_rated_thanks: "Danke für Ihre Bewertung!",
      toast_image_inserted: "Bild eingefügt: ",
      toast_image_file: "Bilddatei: ",
      toast_image_saved: "Bild gespeichert: "
    },
    "es": {
      tab_files: "Archivos",
      tab_files_title: "Área de trabajo / Archivos",
      tab_outline: "Esquema",
      tab_outline_title: "Índice de contenido y estadísticas",
      tab_search: "Buscar",
      tab_search_title: "Buscar en el documento (Ctrl+F)",
      no_folder_open: "Ninguna carpeta abierta",
      refresh_folder_title: "Actualizar (F5)",
      open_file_btn: "Abrir archivo",
      open_folder_btn: "Seleccionar carpeta",
      folder_tree_empty_hint: "Selecciona una carpeta para ver tus notas y archivos en árbol.",
      new_tab_title: "Nuevo documento (Ctrl+N, Ctrl+T)",
      close_tab_title: "Cerrar (Ctrl+W)",
      untitled_doc: "Sin título",
      stat_title: "Estadísticas del documento",
      stat_words: "Palabras",
      stat_chars: "Caracteres",
      stat_reading_time: "Tiempo de lectura",
      stat_time_unit: "min",
      stat_path: "Ruta del archivo",
      search_placeholder: "Buscar en el documento (Ctrl+F)...",
      search_prev_title: "Coincidencia anterior (Mayús+Intro)",
      search_next_title: "Coincidencia siguiente (Intro)",
      search_no_match: "No se encontraron coincidencias",
      search_matches: "coincidencias",
      toc_empty: "No se encontraron encabezados en el documento.",
      width_mode: "Ancho de lectura / Diseño",
      width_narrow: "Compacto",
      width_readable: "Óptimo",
      width_readable_title: "Longitud de línea ideal para evitar la fatiga visual (~65–75 caracteres)",
      width_comfortable: "Holgado",
      width_wide: "Amplio",
      width_full: "Total",
      theme_toggle_title: "Cambiar tema (Oscuro / OLED / Claro) (Alt+Mayús+T)",
      sidebar_toggle_title: "Mostrar/ocultar barra lateral (Alt+Mayús+B)",
      menu_more_title: "Opciones",
      menu_lang: "Idioma",
      menu_scale: "Escala de la interfaz",
      menu_scale_dec: "Reducir escala",
      menu_scale_inc: "Aumentar escala",
      menu_font: "Tamaño de fuente",
      menu_font_dec: "Reducir fuente",
      menu_font_inc: "Aumentar fuente",
      menu_save_as: "Guardar como...",
      menu_copy_html: "Copiar como HTML con formato",
      menu_print: "Imprimir / Exportar a PDF...",
      app_desc: "Visor de Markdown y Texto",
      copy_code_btn: "Copiar",
      copied_text: "¡Copiado!",
      copy_html_alert: "¡HTML con formato copiado al portapapeles!",
      edit_mode: "Modo de edición (Ctrl+E)",
      save_btn: "Guardar",
      save_btn_title: "Guardar cambios (Ctrl+S)",
      save_confirm_prompt: "¿Desea guardar los cambios en este documento?",
      btn_yes: "Guardar",
      btn_no: "No guardar",
      btn_cancel: "Cancelar",
      saved_toast: "¡Cambios guardados correctamente!",
      doc_up_to_date: "El documento ya está actualizado.",
      tool_h1: "Encabezado 1 (Ctrl+1)",
      tool_h2: "Encabezado 2 (Ctrl+2)",
      tool_bold: "Negrita (Ctrl+B)",
      tool_italic: "Cursiva (Ctrl+I)",
      tool_ul: "Lista con viñetas",
      tool_bullet_dash: "Guion",
      tool_bullet_dot: "Viñeta",
      tool_bullet_numbered: "Numerada",
      tool_ol: "Lista numerada",
      tool_quote: "Cita / Sangría",
      tool_code: "Bloque de código",
      tool_raw: "Editor Markdown sin formato",
      menu_convert_txt: "Convertir a TXT...",
      menu_convert_md: "Convertir a MD...",
      convert_md_txt_warn: "Es posible que se pierda el formato al cambiar a texto sin formato. ¿Cómo desea guardar?",
      convert_rendered_opt: "Texto con formato",
      convert_raw_opt: "Código Markdown",
      convert_success_toast: "¡Documento convertido con éxito!",
      empty_title: "Primeros pasos",
      empty_desc: "Cree un documento nuevo o abra un archivo existente para comenzar.",
      empty_btn_new: "Nuevo documento (Ctrl+N)",
      empty_btn_open: "Abrir archivo...",
      empty_hint: "💡 Consejo: Arrastre un archivo aquí o selecciónelo desde el árbol de carpetas.",
      tabs_dropdown_title: "Todas las pestañas abiertas",
      tabs_search_placeholder: "Buscar pestañas abiertas...",
      external_mode_tab: "Archivos externos: Se abren en nueva pestaña (Clic para nueva ventana)",
      external_mode_window: "Archivos externos: Se abren en nueva ventana (Clic para nueva pestaña)",
      external_mode_menu_tab: "Archivos externos: Nueva pestaña",
      external_mode_menu_win: "Archivos externos: Nueva ventana",
      external_mode_badge_tab: "Nueva pestaña",
      external_mode_badge_win: "Nueva ventana",
      menu_external_mode: "Archivos externos",
      menu_open_folder: "📁 Abrir carpeta / Área de trabajo...",
      tabs_scroll_left_title: "Desplazar a la izquierda",
      tabs_scroll_right_title: "Desplazar a la derecha",
      github_link_title: "Repositorio GitHub",
      app_rate: "Valorar",
      rate_link_title: "Valorar en Microsoft Store",
      app_rated_thanks: "¡Gracias por valorar!",
      toast_image_inserted: "Imagen insertada: ",
      toast_image_file: "Archivo de imagen: ",
      toast_image_saved: "Imagen guardada: "
    },
    "fr": {
      tab_files: "Fichiers",
      tab_files_title: "Espace de travail / Fichiers",
      tab_outline: "Plan",
      tab_outline_title: "Table des matières et statistiques",
      tab_search: "Chercher",
      tab_search_title: "Rechercher dans le document (Ctrl+F)",
      no_folder_open: "Aucun dossier ouvert",
      refresh_folder_title: "Actualiser (F5)",
      open_file_btn: "Ouvrir un fichier",
      open_folder_btn: "Choisir un dossier",
      folder_tree_empty_hint: "Sélectionnez un dossier pour afficher l'arborescence des fichiers.",
      new_tab_title: "Nouveau document (Ctrl+N, Ctrl+T)",
      close_tab_title: "Fermer (Ctrl+W)",
      untitled_doc: "Sans titre",
      stat_title: "Statistiques du document",
      stat_words: "Mots",
      stat_chars: "Caractères",
      stat_reading_time: "Temps de lecture",
      stat_time_unit: "min",
      stat_path: "Emplacement du fichier",
      search_placeholder: "Rechercher dans le document (Ctrl+F)...",
      search_prev_title: "Résultat précédent (Maj+Entrée)",
      search_next_title: "Résultat suivant (Entrée)",
      search_no_match: "Aucun résultat trouvé",
      search_matches: "occurrences",
      toc_empty: "Aucun titre trouvé dans le document.",
      width_mode: "Largeur de lecture / Mise en page",
      width_narrow: "Compact",
      width_readable: "Lisible",
      width_readable_title: "Longueur de ligne optimale pour la lecture (~65–75 caractères)",
      width_comfortable: "Confortable",
      width_wide: "Large",
      width_full: "Plein écran",
      theme_toggle_title: "Changer de thème (Sombre / OLED / Clair) (Alt+Maj+T)",
      sidebar_toggle_title: "Afficher/masquer la barre latérale (Alt+Maj+B)",
      menu_more_title: "Options",
      menu_lang: "Langue",
      menu_scale: "Échelle de l'interface",
      menu_scale_dec: "Réduire l'interface",
      menu_scale_inc: "Agrandir l'interface",
      menu_font: "Taille du texte",
      menu_font_dec: "Réduire la police",
      menu_font_inc: "Agrandir la police",
      menu_save_as: "Enregistrer sous...",
      menu_copy_html: "Copier au format HTML enrichi",
      menu_print: "Imprimer / Exporter en PDF...",
      app_desc: "Visionneuse Markdown & Texte",
      copy_code_btn: "Copier",
      copied_text: "Copié !",
      copy_html_alert: "HTML enrichi copié dans le presse-papiers !",
      edit_mode: "Mode édition (Ctrl+E)",
      save_btn: "Enregistrer",
      save_btn_title: "Enregistrer les modifications (Ctrl+S)",
      save_confirm_prompt: "Voulez-vous enregistrer les modifications apportées à ce document ?",
      btn_yes: "Enregistrer",
      btn_no: "Ne pas enregistrer",
      btn_cancel: "Annuler",
      saved_toast: "Modifications enregistrées avec succès !",
      doc_up_to_date: "Le document est déjà à jour.",
      tool_h1: "Titre 1 (Ctrl+1)",
      tool_h2: "Titre 2 (Ctrl+2)",
      tool_bold: "Gras (Ctrl+B)",
      tool_italic: "Italique (Ctrl+I)",
      tool_ul: "Liste à puces",
      tool_bullet_dash: "Tiret",
      tool_bullet_dot: "Puce",
      tool_bullet_numbered: "Numérotée",
      tool_ol: "Liste numérotée",
      tool_quote: "Citation / Retrait",
      tool_code: "Bloc de code",
      tool_raw: "Éditeur Markdown brut",
      menu_convert_txt: "Convertir en TXT...",
      menu_convert_md: "Convertir en MD...",
      convert_md_txt_warn: "Le formatage Markdown peut être perdu lors de la conversion en texte brut. Comment souhaitez-vous enregistrer ?",
      convert_rendered_opt: "Texte mis en forme",
      convert_raw_opt: "Code Markdown brut",
      convert_success_toast: "Document converti avec succès !",
      empty_title: "Pour commencer",
      empty_desc: "Créez un nouveau document ou ouvrez un fichier pour démarrer.",
      empty_btn_new: "Nouveau document (Ctrl+N)",
      empty_btn_open: "Ouvrir un fichier...",
      empty_hint: "💡 Conseil : Glissez-déposez un fichier ici ou sélectionnez-le dans l'arborescence.",
      tabs_dropdown_title: "Tous les onglets ouverts",
      tabs_search_placeholder: "Rechercher parmi les onglets...",
      external_mode_tab: "Fichiers externes : S'ouvrent dans un nouvel onglet (Cliquer pour Nouvelle fenêtre)",
      external_mode_window: "Fichiers externes : S'ouvrent dans une nouvelle fenêtre (Cliquer pour Nouvel onglet)",
      external_mode_menu_tab: "Fichiers externes : Nouvel onglet",
      external_mode_menu_win: "Fichiers externes : Nouvelle fenêtre",
      external_mode_badge_tab: "Nouvel onglet",
      external_mode_badge_win: "Nouvelle fenêtre",
      menu_external_mode: "Fichiers externes",
      menu_open_folder: "📁 Ouvrir un dossier / Espace de travail...",
      tabs_scroll_left_title: "Défiler vers la gauche",
      tabs_scroll_right_title: "Défiler vers la droite",
      github_link_title: "Dépôt GitHub",
      app_rate: "Évaluer",
      rate_link_title: "Évaluer sur le Microsoft Store",
      app_rated_thanks: "Merci pour votre avis !",
      toast_image_inserted: "Image insérée : ",
      toast_image_file: "Fichier image : ",
      toast_image_saved: "Image enregistrée : "
    },
    "it": {
      tab_files: "File",
      tab_files_title: "Spazio di lavoro / File",
      tab_outline: "Struttura",
      tab_outline_title: "Indice e statistiche",
      tab_search: "Cerca",
      tab_search_title: "Cerca nel documento (Ctrl+F)",
      no_folder_open: "Nessuna cartella aperta",
      refresh_folder_title: "Aggiorna (F5)",
      open_file_btn: "Apri file",
      open_folder_btn: "Seleziona cartella",
      folder_tree_empty_hint: "Seleziona una cartella per visualizzare i tuoi file ad albero.",
      new_tab_title: "Nuovo documento (Ctrl+N, Ctrl+T)",
      close_tab_title: "Chiudi (Ctrl+W)",
      untitled_doc: "Senza titolo",
      stat_title: "Statistiche del documento",
      stat_words: "Parole",
      stat_chars: "Caratteri",
      stat_reading_time: "Tempo di lettura",
      stat_time_unit: "min",
      stat_path: "Percorso del file",
      search_placeholder: "Cerca nel documento (Ctrl+F)...",
      search_prev_title: "Risultato precedente (Maiusc+Invio)",
      search_next_title: "Risultato successivo (Invio)",
      search_no_match: "Nessuna corrispondenza",
      search_matches: "corrispondenze",
      toc_empty: "Nessuna intestazione trovata nel documento.",
      width_mode: "Larghezza di lettura / Layout",
      width_narrow: "Compatto",
      width_readable: "Leggibile",
      width_readable_title: "Lunghezza di riga ideale per la lettura (~65–75 caratteri)",
      width_comfortable: "Rilassato",
      width_wide: "Ampio",
      width_full: "Intero",
      theme_toggle_title: "Cambia tema (Scuro / OLED / Chiaro) (Alt+Maiusc+T)",
      sidebar_toggle_title: "Mostra/nascondi barra laterale (Alt+Maiusc+B)",
      menu_more_title: "Opzioni",
      menu_lang: "Lingua",
      menu_scale: "Scala interfaccia",
      menu_scale_dec: "Riduci interfaccia",
      menu_scale_inc: "Ingrandisci interfaccia",
      menu_font: "Dimensione testo",
      menu_font_dec: "Riduci testo",
      menu_font_inc: "Ingrandisci testo",
      menu_save_as: "Salva con nome...",
      menu_copy_html: "Copia come HTML formattato",
      menu_print: "Stampa / Esporta in PDF...",
      app_desc: "Visualizzatore Markdown e Testo",
      copy_code_btn: "Copia",
      copied_text: "Copiato!",
      copy_html_alert: "HTML formattato copiato negli appunti!",
      edit_mode: "Modalità di modifica (Ctrl+E)",
      save_btn: "Salva",
      save_btn_title: "Salva modifiche (Ctrl+S)",
      save_confirm_prompt: "Salvare le modifiche a questo documento?",
      btn_yes: "Salva",
      btn_no: "Non salvare",
      btn_cancel: "Annulla",
      saved_toast: "Modifiche salvate con successo!",
      doc_up_to_date: "Il documento è già aggiornato.",
      tool_h1: "Titolo 1 (Ctrl+1)",
      tool_h2: "Titolo 2 (Ctrl+2)",
      tool_bold: "Grassetto (Ctrl+B)",
      tool_italic: "Corsivo (Ctrl+I)",
      tool_ul: "Elenco puntato",
      tool_bullet_dash: "Trattino",
      tool_bullet_dot: "Punto",
      tool_bullet_numbered: "Numerato",
      tool_ol: "Elenco numerato",
      tool_quote: "Citazione / Rientro",
      tool_code: "Blocco di codice",
      tool_raw: "Editor Markdown non formattato",
      menu_convert_txt: "Converti in TXT...",
      menu_convert_md: "Converti in MD...",
      convert_md_txt_warn: "La formattazione potrebbe andare persa passando a solo testo. Come desideri salvare?",
      convert_rendered_opt: "Testo formattato",
      convert_raw_opt: "Markdown grezzo",
      convert_success_toast: "Documento convertito con successo!",
      empty_title: "Per iniziare",
      empty_desc: "Crea un nuovo documento o apri un file esistente per iniziare a lavorare.",
      empty_btn_new: "Nuovo documento (Ctrl+N)",
      empty_btn_open: "Apri file...",
      empty_hint: "💡 Suggerimento: Trascina un file qui o selezionalo dall'albero delle cartelle.",
      tabs_dropdown_title: "Tutte le schede aperte",
      tabs_search_placeholder: "Cerca schede aperte...",
      external_mode_tab: "File esterni: Si aprono come nuova scheda (Clic per Nuova finestra)",
      external_mode_window: "File esterni: Si aprono in una nuova finestra (Clic per Nuova scheda)",
      external_mode_menu_tab: "File esterni: Nuova scheda",
      external_mode_menu_win: "File esterni: Nuova finestra",
      external_mode_badge_tab: "Nuova scheda",
      external_mode_badge_win: "Nuova finestra",
      menu_external_mode: "File esterni",
      menu_open_folder: "📁 Apri cartella / Spazio di lavoro...",
      tabs_scroll_left_title: "Scorri a sinistra",
      tabs_scroll_right_title: "Scorri a destra",
      github_link_title: "Repository GitHub",
      app_rate: "Valuta",
      rate_link_title: "Valuta su Microsoft Store",
      app_rated_thanks: "Grazie per la recensione!",
      toast_image_inserted: "Immagine inserita: ",
      toast_image_file: "File immagine: ",
      toast_image_saved: "Immagine salvata: "
    },
    "pt": {
      tab_files: "Arquivos",
      tab_files_title: "Espaço de trabalho / Arquivos",
      tab_outline: "Sumário",
      tab_outline_title: "Índice e Estatísticas",
      tab_search: "Buscar",
      tab_search_title: "Localizar no documento (Ctrl+F)",
      no_folder_open: "Nenhuma pasta aberta",
      refresh_folder_title: "Atualizar (F5)",
      open_file_btn: "Abrir arquivo",
      open_folder_btn: "Selecionar pasta",
      folder_tree_empty_hint: "Selecione uma pasta para ver suas notas e arquivos em árvore.",
      new_tab_title: "Novo documento (Ctrl+N, Ctrl+T)",
      close_tab_title: "Fechar (Ctrl+W)",
      untitled_doc: "Sem título",
      stat_title: "Estatísticas do documento",
      stat_words: "Palavras",
      stat_chars: "Caracteres",
      stat_reading_time: "Tempo de leitura",
      stat_time_unit: "min",
      stat_path: "Local do arquivo",
      search_placeholder: "Localizar no documento (Ctrl+F)...",
      search_prev_title: "Ocorrência anterior (Shift+Enter)",
      search_next_title: "Próxima ocorrência (Enter)",
      search_no_match: "Nenhuma correspondência",
      search_matches: "correspondências",
      toc_empty: "Nenhum título encontrado no documento.",
      width_mode: "Largura de leitura / Layout",
      width_narrow: "Compacto",
      width_readable: "Legível",
      width_readable_title: "Comprimento ideal de linha para leitura (~65–75 caracteres)",
      width_comfortable: "Confortável",
      width_wide: "Largo",
      width_full: "Total",
      theme_toggle_title: "Alternar tema (Escuro / OLED / Claro) (Alt+Shift+T)",
      sidebar_toggle_title: "Exibir/ocultar barra lateral (Alt+Shift+B)",
      menu_more_title: "Opções",
      menu_lang: "Idioma",
      menu_scale: "Escala da interface",
      menu_scale_dec: "Diminuir interface",
      menu_scale_inc: "Aumentar interface",
      menu_font: "Tamanho da fonte",
      menu_font_dec: "Diminuir fonte",
      menu_font_inc: "Aumentar fonte",
      menu_save_as: "Salvar como...",
      menu_copy_html: "Copiar como HTML formatado",
      menu_print: "Imprimir / Exportar para PDF...",
      app_desc: "Visualizador de Markdown e Texto",
      copy_code_btn: "Copiar",
      copied_text: "Copiado!",
      copy_html_alert: "HTML formatado copiado para a área de transferência!",
      edit_mode: "Modo de edição (Ctrl+E)",
      save_btn: "Salvar",
      save_btn_title: "Salvar alterações (Ctrl+S)",
      save_confirm_prompt: "Deseja salvar as alterações neste documento?",
      btn_yes: "Salvar",
      btn_no: "Não salvar",
      btn_cancel: "Cancelar",
      saved_toast: "Alterações salvas com sucesso!",
      doc_up_to_date: "O documento já está atualizado.",
      tool_h1: "Título 1 (Ctrl+1)",
      tool_h2: "Título 2 (Ctrl+2)",
      tool_bold: "Negrito (Ctrl+B)",
      tool_italic: "Itálico (Ctrl+I)",
      tool_ul: "Lista com marcadores",
      tool_bullet_dash: "Traço",
      tool_bullet_dot: "Ponto",
      tool_bullet_numbered: "Numerada",
      tool_ol: "Lista numerada",
      tool_quote: "Citação / Recuo",
      tool_code: "Bloco de código",
      tool_raw: "Editor Markdown bruto",
      menu_convert_txt: "Converter para TXT...",
      menu_convert_md: "Converter para MD...",
      convert_md_txt_warn: "A formatação pode ser perdida ao mudar para texto puro. Como deseja salvar?",
      convert_rendered_opt: "Texto formatado",
      convert_raw_opt: "Código Markdown",
      convert_success_toast: "Documento convertido com sucesso!",
      empty_title: "Primeiros passos",
      empty_desc: "Crie um novo documento ou abra um arquivo existente para começar.",
      empty_btn_new: "Novo documento (Ctrl+N)",
      empty_btn_open: "Abrir arquivo...",
      empty_hint: "💡 Dica: Arraste e solte um arquivo aqui ou selecione na árvore de pastas.",
      tabs_dropdown_title: "Todas as abas abertas",
      tabs_search_placeholder: "Pesquisar abas abertas...",
      external_mode_tab: "Arquivos externos: Abrem como nova aba (Clique para Nova janela)",
      external_mode_window: "Arquivos externos: Abrem em nova janela (Clique para Nova aba)",
      external_mode_menu_tab: "Arquivos externos: Nova aba",
      external_mode_menu_win: "Arquivos externos: Nova janela",
      external_mode_badge_tab: "Nova aba",
      external_mode_badge_win: "Nova janela",
      menu_external_mode: "Arquivos externos",
      menu_open_folder: "📁 Abrir pasta / Espaço de trabalho...",
      tabs_scroll_left_title: "Rolar para a esquerda",
      tabs_scroll_right_title: "Rolar para a direita",
      github_link_title: "Repositório GitHub",
      app_rate: "Avaliar",
      rate_link_title: "Avaliar na Microsoft Store",
      app_rated_thanks: "Obrigado por avaliar!",
      toast_image_inserted: "Imagem inserida: ",
      toast_image_file: "Arquivo de imagem: ",
      toast_image_saved: "Imagem salva: "
    },
    "nl": {
      tab_files: "Bestanden",
      tab_files_title: "Werkruimte / Bestanden",
      tab_outline: "Overzicht",
      tab_outline_title: "Inhoudsopgave & Statistieken",
      tab_search: "Zoeken",
      tab_search_title: "Zoeken in document (Ctrl+F)",
      no_folder_open: "Geen map geopend",
      refresh_folder_title: "Vernieuwen (F5)",
      open_file_btn: "Bestand openen",
      open_folder_btn: "Map kiezen",
      folder_tree_empty_hint: "Selecteer een map om bestanden als boomstructuur te zien.",
      new_tab_title: "Nieuw document (Ctrl+N, Ctrl+T)",
      close_tab_title: "Sluiten (Ctrl+W)",
      untitled_doc: "Naamloos",
      stat_title: "Documentstatistieken",
      stat_words: "Woorden",
      stat_chars: "Tekens",
      stat_reading_time: "Leestijd",
      stat_time_unit: "min",
      stat_path: "Bestandslocatie",
      search_placeholder: "Zoeken in document (Ctrl+F)...",
      search_prev_title: "Vorige overeenkomst (Shift+Enter)",
      search_next_title: "Volgende overeenkomst (Enter)",
      search_no_match: "Geen overeenkomsten gevonden",
      search_matches: "overeenkomsten",
      toc_empty: "Geen koppen gevonden in dit document.",
      width_mode: "Leesbreedte / Paginalay-out",
      width_narrow: "Compact",
      width_readable: "Leesbaar",
      width_readable_title: "Optimale regellengte voor rustig lezen (~65–75 tekens)",
      width_comfortable: "Ruim",
      width_wide: "Breed",
      width_full: "Volledig scherm",
      theme_toggle_title: "Thema wisselen (Donker / OLED / Licht) (Alt+Shift+T)",
      sidebar_toggle_title: "Zijbalk in-/uitschakelen (Alt+Shift+B)",
      menu_more_title: "Opties",
      menu_lang: "Taal",
      menu_scale: "UI-schaal",
      menu_scale_dec: "Interface verkleinen",
      menu_scale_inc: "Interface vergroten",
      menu_font: "Tekstgrootte",
      menu_font_dec: "Tekst verkleinen",
      menu_font_inc: "Tekst vergroten",
      menu_save_as: "Opslaan als...",
      menu_copy_html: "Kopiëren als opgemaakte HTML",
      menu_print: "Afdrukken / Exporteren naar PDF...",
      app_desc: "Markdown- en tekstviewer",
      copy_code_btn: "Kopiëren",
      copied_text: "Gekopieerd!",
      copy_html_alert: "Opgemaakte HTML naar klembord gekopieerd!",
      edit_mode: "Bewerkingsmodus (Ctrl+E)",
      save_btn: "Opslaan",
      save_btn_title: "Wijzigingen opslaan (Ctrl+S)",
      save_confirm_prompt: "Wilt u wijzigingen in dit document opslaan?",
      btn_yes: "Opslaan",
      btn_no: "Niet opslaan",
      btn_cancel: "Annuleren",
      saved_toast: "Wijzigingen succesvol opgeslagen!",
      doc_up_to_date: "Document is al up-to-date.",
      tool_h1: "Kop 1 (Ctrl+1)",
      tool_h2: "Kop 2 (Ctrl+2)",
      tool_bold: "Vet (Ctrl+B)",
      tool_italic: "Cursief (Ctrl+I)",
      tool_ul: "Opsommingslijst",
      tool_bullet_dash: "Streepje",
      tool_bullet_dot: "Punt",
      tool_bullet_numbered: "Genummerd",
      tool_ol: "Genummerde lijst",
      tool_quote: "Citaat / Inspringen",
      tool_code: "Codeblok",
      tool_raw: "Markdown-broncode-editor",
      menu_convert_txt: "Converteren naar TXT...",
      menu_convert_md: "Converteren naar MD...",
      convert_md_txt_warn: "Opmaak kan verloren gaan bij conversie naar platte tekst. Hoe wilt u opslaan?",
      convert_rendered_opt: "Opgemaakte tekst",
      convert_raw_opt: "Ruwe Markdown",
      convert_success_toast: "Document succesvol geconverteerd!",
      empty_title: "Aan de slag",
      empty_desc: "Maak een nieuw document of open een bestand om te beginnen.",
      empty_btn_new: "Nieuw document (Ctrl+N)",
      empty_btn_open: "Bestand openen...",
      empty_hint: "💡 Tip: Sleep een bestand hierheen of kies er een uit de mappenstructuur.",
      tabs_dropdown_title: "Alle geopende tabbladen",
      tabs_search_placeholder: "Open tabbladen doorzoeken...",
      external_mode_tab: "Externe bestanden: Worden als nieuw tabblad geopend (Klik voor Nieuw venster)",
      external_mode_window: "Externe bestanden: Worden in een nieuw venster geopend (Klik voor Nieuw tabblad)",
      external_mode_menu_tab: "Externe bestanden: Nieuw tabblad",
      external_mode_menu_win: "Externe bestanden: Nieuw venster",
      external_mode_badge_tab: "Nieuw tabblad",
      external_mode_badge_win: "Nieuw venster",
      menu_external_mode: "Externe bestanden",
      menu_open_folder: "📁 Map / Werkruimte openen...",
      tabs_scroll_left_title: "Naar links scrollen",
      tabs_scroll_right_title: "Naar rechts scrollen",
      github_link_title: "GitHub-opslagplaats",
      app_rate: "Beoordelen",
      rate_link_title: "Beoordelen in Microsoft Store",
      app_rated_thanks: "Bedankt voor je beoordeling!",
      toast_image_inserted: "Afbeelding ingevoegd: ",
      toast_image_file: "Afbeeldingsbestand: ",
      toast_image_saved: "Afbeelding opgeslagen: "
    },
    "pl": {
      tab_files: "Pliki",
      tab_files_title: "Obszar roboczy / Pliki",
      tab_outline: "Konspekt",
      tab_outline_title: "Spis treści i statystyki",
      tab_search: "Szukaj",
      tab_search_title: "Szukaj w dokumencie (Ctrl+F)",
      no_folder_open: "Brak otwartego folderu",
      refresh_folder_title: "Odśwież (F5)",
      open_file_btn: "Otwórz plik",
      open_folder_btn: "Wybierz folder",
      folder_tree_empty_hint: "Wybierz folder, aby wyświetlić notatki i pliki w drzewie.",
      new_tab_title: "Nowy dokument (Ctrl+N, Ctrl+T)",
      close_tab_title: "Zamknij (Ctrl+W)",
      untitled_doc: "Bez tytułu",
      stat_title: "Statystyki dokumentu",
      stat_words: "Słowa",
      stat_chars: "Znaki",
      stat_reading_time: "Czas czytania",
      stat_time_unit: "min",
      stat_path: "Ścieżka pliku",
      search_placeholder: "Szukaj w dokumencie (Ctrl+F)...",
      search_prev_title: "Poprzednie dopasowanie (Shift+Enter)",
      search_next_title: "Następne dopasowanie (Enter)",
      search_no_match: "Brak wyników",
      search_matches: "dopasowań",
      toc_empty: "Nie znaleziono nagłówków w dokumencie.",
      width_mode: "Szerokość tekstu / Układ",
      width_narrow: "Zwarty",
      width_readable: "Czytelny",
      width_readable_title: "Optymalna długość linii dla wzroku (~65–75 znaków)",
      width_comfortable: "Swobodny",
      width_wide: "Szeroki",
      width_full: "Pełny",
      theme_toggle_title: "Przełącz motyw (Ciemny / OLED / Jasny) (Alt+Shift+T)",
      sidebar_toggle_title: "Pokaż/ukryj pasek boczny (Alt+Shift+B)",
      menu_more_title: "Opcje",
      menu_lang: "Język",
      menu_scale: "Skala interfejsu",
      menu_scale_dec: "Zmniejsz interfejs",
      menu_scale_inc: "Zwiększ interfejs",
      menu_font: "Rozmiar czcionki",
      menu_font_dec: "Zmniejsz czcionkę",
      menu_font_inc: "Zwiększ czcionkę",
      menu_save_as: "Zapisz jako...",
      menu_copy_html: "Kopiuj jako sformatowany HTML",
      menu_print: "Drukuj / Eksportuj do PDF...",
      app_desc: "Przeglądarka Markdown i tekstu",
      copy_code_btn: "Kopiuj",
      copied_text: "Skopiowano!",
      copy_html_alert: "Sformatowany HTML skopiowano do schowka!",
      edit_mode: "Tryb edycji (Ctrl+E)",
      save_btn: "Zapisz",
      save_btn_title: "Zapisz zmiany (Ctrl+S)",
      save_confirm_prompt: "Czy chcesz zapisać zmiany w tym dokumencie?",
      btn_yes: "Zapisz",
      btn_no: "Nie zapisuj",
      btn_cancel: "Anuluj",
      saved_toast: "Zmiany zostały pomyślnie zapisane!",
      doc_up_to_date: "Dokument jest już aktualny.",
      tool_h1: "Nagłówek 1 (Ctrl+1)",
      tool_h2: "Nagłówek 2 (Ctrl+2)",
      tool_bold: "Pogrubienie (Ctrl+B)",
      tool_italic: "Kursywa (Ctrl+I)",
      tool_ul: "Lista wypunktowana",
      tool_bullet_dash: "Myślnik",
      tool_bullet_dot: "Kropka",
      tool_bullet_numbered: "Numerowana",
      tool_ol: "Lista numerowana",
      tool_quote: "Cytat / Wcięcie",
      tool_code: "Blok kodu",
      tool_raw: "Edytor czystego Markdownu",
      menu_convert_txt: "Konwertuj na TXT...",
      menu_convert_md: "Konwertuj na MD...",
      convert_md_txt_warn: "Formatowanie Markdown może zostać utracone przy zmianie na zwykły tekst. Jak chcesz zapisać?",
      convert_rendered_opt: "Sformatowany tekst",
      convert_raw_opt: "Kod źródłowy Markdown",
      convert_success_toast: "Dokument pomyślnie przekonwertowany!",
      empty_title: "Rozpocznij pracę",
      empty_desc: "Utwórz nowy dokument lub otwórz istniejący plik, aby rozpocząć.",
      empty_btn_new: "Nowy dokument (Ctrl+N)",
      empty_btn_open: "Otwórz plik...",
      empty_hint: "💡 Wskazówka: Przeciągnij plik tutaj lub wybierz go z drzewa folderów.",
      tabs_dropdown_title: "Wszystkie otwarte karty",
      tabs_search_placeholder: "Szukaj otwartych kart...",
      external_mode_tab: "Zewnętrzne pliki: Otwierane w nowej karcie (Kliknij dla nowego okna)",
      external_mode_window: "Zewnętrzne pliki: Otwierane w nowym oknie (Kliknij dla nowej karty)",
      external_mode_menu_tab: "Zewnętrzne pliki: Nowa karta",
      external_mode_menu_win: "Zewnętrzne pliki: Nowe okno",
      external_mode_badge_tab: "Nowa karta",
      external_mode_badge_win: "Nowe okno",
      menu_external_mode: "Zewnętrzne pliki",
      menu_open_folder: "📁 Otwórz folder / Obszar roboczy...",
      tabs_scroll_left_title: "Przewiń w lewo",
      tabs_scroll_right_title: "Przewiń w prawo",
      github_link_title: "Repozytorium GitHub",
      app_rate: "Oceń",
      rate_link_title: "Oceń w Microsoft Store",
      app_rated_thanks: "Dziękujemy za ocenę!",
      toast_image_inserted: "Wstawiono obraz: ",
      toast_image_file: "Plik obrazu: ",
      toast_image_saved: "Zapisano obraz: "
    },
    "ru": {
      tab_files: "Файлы",
      tab_files_title: "Рабочая область / Файлы",
      tab_outline: "Оглавление",
      tab_outline_title: "Содержание и статистика",
      tab_search: "Поиск",
      tab_search_title: "Поиск в документе (Ctrl+F)",
      no_folder_open: "Папка не открыта",
      refresh_folder_title: "Обновить (F5)",
      open_file_btn: "Открыть файл",
      open_folder_btn: "Выбрать папку",
      folder_tree_empty_hint: "Выберите папку для просмотра заметок и файлов в виде дерева.",
      new_tab_title: "Новый документ (Ctrl+N, Ctrl+T)",
      close_tab_title: "Закрыть (Ctrl+W)",
      untitled_doc: "Без названия",
      stat_title: "Статистика документа",
      stat_words: "Слов",
      stat_chars: "Символов",
      stat_reading_time: "Время чтения",
      stat_time_unit: "мин",
      stat_path: "Путь к файлу",
      search_placeholder: "Поиск в документе (Ctrl+F)...",
      search_prev_title: "Предыдущее совпадение (Shift+Enter)",
      search_next_title: "Следующее совпадение (Enter)",
      search_no_match: "Совпадений не найдено",
      search_matches: "совпадений",
      toc_empty: "Заголовков в документе не обнаружено.",
      width_mode: "Ширина чтения / Макет",
      width_narrow: "Компактная",
      width_readable: "Удобная",
      width_readable_title: "Оптимальная длина строки для комфортного чтения (~65–75 знаков)",
      width_comfortable: "Свободная",
      width_wide: "Широкая",
      width_full: "На весь экран",
      theme_toggle_title: "Сменить тему (Темная / OLED / Светлая) (Alt+Shift+T)",
      sidebar_toggle_title: "Показать/скрыть боковую панель (Alt+Shift+B)",
      menu_more_title: "Параметры",
      menu_lang: "Язык",
      menu_scale: "Масштаб интерфейса",
      menu_scale_dec: "Уменьшить интерфейс",
      menu_scale_inc: "Увеличить интерфейс",
      menu_font: "Размер шрифта",
      menu_font_dec: "Уменьшить шрифт",
      menu_font_inc: "Увеличить шрифт",
      menu_save_as: "Сохранить как...",
      menu_copy_html: "Копировать как форматированный HTML",
      menu_print: "Печать / Экспорт в PDF...",
      app_desc: "Просмотрщик Markdown и текста",
      copy_code_btn: "Копировать",
      copied_text: "Скопировано!",
      copy_html_alert: "Форматированный HTML скопирован в буфер обмена!",
      edit_mode: "Режим редактирования (Ctrl+E)",
      save_btn: "Сохранить",
      save_btn_title: "Сохранить изменения (Ctrl+S)",
      save_confirm_prompt: "Сохранить изменения в этом документе?",
      btn_yes: "Сохранить",
      btn_no: "Не сохранять",
      btn_cancel: "Отмена",
      saved_toast: "Изменения успешно сохранены!",
      doc_up_to_date: "Документ не изменялся.",
      tool_h1: "Заголовок 1 (Ctrl+1)",
      tool_h2: "Заголовок 2 (Ctrl+2)",
      tool_bold: "Полужирный (Ctrl+B)",
      tool_italic: "Курсив (Ctrl+I)",
      tool_ul: "Маркированный список",
      tool_bullet_dash: "Тире",
      tool_bullet_dot: "Точка",
      tool_bullet_numbered: "Нумерованный",
      tool_ol: "Нумерованный список",
      tool_quote: "Цитата / Отступ",
      tool_code: "Блок кода",
      tool_raw: "Исходный Markdown-редактор",
      menu_convert_txt: "Конвертировать в TXT...",
      menu_convert_md: "Конвертировать в MD...",
      convert_md_txt_warn: "При конвертации в обычный текст форматирование может быть утеряно. Как сохранить документ?",
      convert_rendered_opt: "Форматированный текст",
      convert_raw_opt: "Исходный код Markdown",
      convert_success_toast: "Документ успешно конвертирован!",
      empty_title: "С чего начать",
      empty_desc: "Создайте новый документ или откройте существующий файл для работы.",
      empty_btn_new: "Новый документ (Ctrl+N)",
      empty_btn_open: "Открыть файл...",
      empty_hint: "💡 Подсказка: Перетащите файл сюда или выберите его в дереве файлов.",
      tabs_dropdown_title: "Все открытые вкладки",
      tabs_search_placeholder: "Поиск среди открытых вкладок...",
      external_mode_tab: "Внешние файлы: открываются в новой вкладке (Нажмите для нового окна)",
      external_mode_window: "Внешние файлы: открываются в новом окне (Нажмите для новой вкладки)",
      external_mode_menu_tab: "Внешние файлы: Новая вкладка",
      external_mode_menu_win: "Внешние файлы: Новое окно",
      external_mode_badge_tab: "Новая вкладка",
      external_mode_badge_win: "Новое окно",
      menu_external_mode: "Внешние файлы",
      menu_open_folder: "📁 Открыть папку / Рабочую область...",
      tabs_scroll_left_title: "Прокрутить влево",
      tabs_scroll_right_title: "Прокрутить вправо",
      github_link_title: "Репозиторий GitHub",
      app_rate: "Оценить",
      rate_link_title: "Оценить в Microsoft Store",
      app_rated_thanks: "Спасибо за оценку!",
      toast_image_inserted: "Изображение вставлено: ",
      toast_image_file: "Файл изображения: ",
      toast_image_saved: "Изображение сохранено: "
    },
    "uk": {
      tab_files: "Файли",
      tab_files_title: "Робоча область / Файли",
      tab_outline: "Зміст",
      tab_outline_title: "Зміст та статистика",
      tab_search: "Пошук",
      tab_search_title: "Пошук у документі (Ctrl+F)",
      no_folder_open: "Папку не відкрито",
      refresh_folder_title: "Оновити (F5)",
      open_file_btn: "Відкрити файл",
      open_folder_btn: "Обрати папку",
      folder_tree_empty_hint: "Оберіть папку, щоб переглядати файли у вигляді дерева.",
      new_tab_title: "Новий документ (Ctrl+N, Ctrl+T)",
      close_tab_title: "Закрити (Ctrl+W)",
      untitled_doc: "Без назви",
      stat_title: "Статистика документа",
      stat_words: "Слів",
      stat_chars: "Символів",
      stat_reading_time: "Час читання",
      stat_time_unit: "хв",
      stat_path: "Шлях до файлу",
      search_placeholder: "Пошук у документі (Ctrl+F)...",
      search_prev_title: "Попередній збіг (Shift+Enter)",
      search_next_title: "Наступний збіг (Enter)",
      search_no_match: "Збігів не знайдено",
      search_matches: "збігів",
      toc_empty: "Заголовків у документі не знайдено.",
      width_mode: "Ширина читання / Макет",
      width_narrow: "Компактна",
      width_readable: "Зручна",
      width_readable_title: "Оптимальна довжина рядка для очей (~65–75 символів)",
      width_comfortable: "Вільна",
      width_wide: "Широка",
      width_full: "На весь екран",
      theme_toggle_title: "Змінити тему (Темна / OLED / Світла) (Alt+Shift+T)",
      sidebar_toggle_title: "Показати/приховати бічну панель (Alt+Shift+B)",
      menu_more_title: "Параметри",
      menu_lang: "Мова",
      menu_scale: "Масштаб інтерфейсу",
      menu_scale_dec: "Зменшити інтерфейс",
      menu_scale_inc: "Збільшити інтерфейс",
      menu_font: "Розмір шрифту",
      menu_font_dec: "Зменшити шрифт",
      menu_font_inc: "Збільшити шрифт",
      menu_save_as: "Зберегти як...",
      menu_copy_html: "Копіювати як форматований HTML",
      menu_print: "Друк / Експорт у PDF...",
      app_desc: "Переглядач Markdown і тексту",
      copy_code_btn: "Копіювати",
      copied_text: "Скопійовано!",
      copy_html_alert: "Форматований HTML скопійовано в буфер обміну!",
      edit_mode: "Режим редагування (Ctrl+E)",
      save_btn: "Зберегти",
      save_btn_title: "Зберегти зміни (Ctrl+S)",
      save_confirm_prompt: "Зберегти зміни в цьому документі?",
      btn_yes: "Зберегти",
      btn_no: "Не зберігати",
      btn_cancel: "Скасувати",
      saved_toast: "Зміни успішно збережено!",
      doc_up_to_date: "Документ не зазнавав змін.",
      tool_h1: "Заголовок 1 (Ctrl+1)",
      tool_h2: "Заголовок 2 (Ctrl+2)",
      tool_bold: "Напівжирний (Ctrl+B)",
      tool_italic: "Курсив (Ctrl+I)",
      tool_ul: "Маркований список",
      tool_bullet_dash: "Тире",
      tool_bullet_dot: "Крапка",
      tool_bullet_numbered: "Нумерований",
      tool_ol: "Нумерований список",
      tool_quote: "Цитата / Відступ",
      tool_code: "Блок коду",
      tool_raw: "Редактор вихідного Markdown",
      menu_convert_txt: "Конвертувати в TXT...",
      menu_convert_md: "Конвертувати в MD...",
      convert_md_txt_warn: "При конвертації у звичайний текст форматування може бути втрачено. Як зберегти документ?",
      convert_rendered_opt: "Форматований текст",
      convert_raw_opt: "Вихідний код Markdown",
      convert_success_toast: "Документ успішно конвертовано!",
      empty_title: "Початок роботи",
      empty_desc: "Створіть новий документ або відкрийте наявний файл, щоб розпочати.",
      empty_btn_new: "Новий документ (Ctrl+N)",
      empty_btn_open: "Відкрити файл...",
      empty_hint: "💡 Порада: Перетягніть файл сюди або виберіть його в дереві папок.",
      tabs_dropdown_title: "Усі відкриті вкладки",
      tabs_search_placeholder: "Пошук серед відкритих вкладок...",
      external_mode_tab: "Зовнішні файли: відкриваються у новій вкладці (Клацніть для нового вікна)",
      external_mode_window: "Зовнішні файли: відкриваються у новому вікні (Клацніть для нової вкладки)",
      external_mode_menu_tab: "Зовнішні файли: Нова вкладка",
      external_mode_menu_win: "Зовнішні файли: Нове вікно",
      external_mode_badge_tab: "Нова вкладка",
      external_mode_badge_win: "Нове вікно",
      menu_external_mode: "Зовнішні файли",
      menu_open_folder: "📁 Відкрити папку / Робочу область...",
      tabs_scroll_left_title: "Прокрутити ліворуч",
      tabs_scroll_right_title: "Прокрутити праворуч",
      github_link_title: "Репозиторій GitHub",
      app_rate: "Оцінити",
      rate_link_title: "Оцінити в Microsoft Store",
      app_rated_thanks: "Дякуємо за оцінку!",
      toast_image_inserted: "Зображення вставлено: ",
      toast_image_file: "Файл зображення: ",
      toast_image_saved: "Зображення збережено: "
    },
    "ar": {
      tab_files: "الملفات",
      tab_files_title: "مساحة العمل / الملفات",
      tab_outline: "المحتوى",
      tab_outline_title: "جدول المحتويات والإحصائيات",
      tab_search: "بحث",
      tab_search_title: "البحث في المستند (Ctrl+F)",
      no_folder_open: "لم يتم فتح مجلد",
      refresh_folder_title: "تحديث (F5)",
      open_file_btn: "فتح ملف",
      open_folder_btn: "اختيار مجلد",
      folder_tree_empty_hint: "حدد مجلداً لعرض ملاحظاتك وملفاتك على هيئة شجرة.",
      new_tab_title: "مستند جديد (Ctrl+N, Ctrl+T)",
      close_tab_title: "إغلاق (Ctrl+W)",
      untitled_doc: "مستند بلا عنوان",
      stat_title: "إحصائيات المستند",
      stat_words: "الكلمات",
      stat_chars: "الحروف",
      stat_reading_time: "وقت القراءة",
      stat_time_unit: "دقيقة",
      stat_path: "مسار الملف",
      search_placeholder: "البحث في المستند (Ctrl+F)...",
      search_prev_title: "التطابق السابق (Shift+Enter)",
      search_next_title: "التطابق التالي (Enter)",
      search_no_match: "لم يتم العثور على تطابقات",
      search_matches: "تطابقات",
      toc_empty: "لم يتم العثور على عناوين في المستند.",
      width_mode: "عرض القراءة / التخطيط",
      width_narrow: "مضغوط",
      width_readable: "مريح للقراءة",
      width_readable_title: "الطول المثالي للسطر لتجنب إجهاد العين (~65-75 حرفاً)",
      width_comfortable: "فسيح",
      width_wide: "عريض",
      width_full: "ملء الشاشة",
      theme_toggle_title: "تبديل المظهر (داكن / OLED / فاتح) (Alt+Shift+T)",
      sidebar_toggle_title: "إظهار/إخفاء الشريط الجانبي (Alt+Shift+B)",
      menu_more_title: "خيارات",
      menu_lang: "اللغة",
      menu_scale: "مقياس الواجهة",
      menu_scale_dec: "تصغير الواجهة",
      menu_scale_inc: "تكبير الواجهة",
      menu_font: "حجم الخط",
      menu_font_dec: "تصغير الخط",
      menu_font_inc: "تكبير الخط",
      menu_save_as: "حفظ باسم...",
      menu_copy_html: "نسخ بتنسيق HTML",
      menu_print: "طباعة / تصدير كـ PDF...",
      app_desc: "عارض ومحرر ماركداون والنصوص",
      copy_code_btn: "نسخ",
      copied_text: "تم النسخ!",
      copy_html_alert: "تم نسخ كود HTML المنسق إلى الحافظة بنجاح!",
      edit_mode: "وضع التحرير (Ctrl+E)",
      save_btn: "حفظ",
      save_btn_title: "حفظ التغييرات (Ctrl+S)",
      save_confirm_prompt: "هل ترغب في حفظ التغييرات التي أجريتها على هذا المستند؟",
      btn_yes: "حفظ",
      btn_no: "عدم الحفظ",
      btn_cancel: "إلغاء",
      saved_toast: "تم حفظ التغييرات بنجاح!",
      doc_up_to_date: "المستند محدث بالفعل.",
      tool_h1: "عنوان 1 (Ctrl+1)",
      tool_h2: "عنوان 2 (Ctrl+2)",
      tool_bold: "عريض (Ctrl+B)",
      tool_italic: "مائل (Ctrl+I)",
      tool_ul: "قائمة نقطية",
      tool_bullet_dash: "شرطة",
      tool_bullet_dot: "نقطة",
      tool_bullet_numbered: "مرقمة",
      tool_ol: "قائمة رقمية",
      tool_quote: "اقتباس / مسافة بادئة",
      tool_code: "كتلة كود",
      tool_raw: "محرر الماركداون الخام",
      menu_convert_txt: "تحويل إلى TXT...",
      menu_convert_md: "تحويل إلى MD...",
      convert_md_txt_warn: "قد تفقد التنسيقات عند التحويل إلى نص عادي. كيف ترغب في الحفظ؟",
      convert_rendered_opt: "نص منسق",
      convert_raw_opt: "كود ماركداون خام",
      convert_success_toast: "تم تحويل المستند بنجاح!",
      empty_title: "البداية",
      empty_desc: "أنشئ مستنداً جديداً أو افتح ملفاً للبدء في العمل.",
      empty_btn_new: "مستند جديد (Ctrl+N)",
      empty_btn_open: "فتح ملف...",
      empty_hint: "💡 تلميح: يمكنك سحب وإفلات ملف هنا أو اختياره من شجرة المجلدات.",
      tabs_dropdown_title: "كافة التبويبات المفتوحة",
      tabs_search_placeholder: "بحث في التبويبات المفتوحة...",
      external_mode_tab: "الملفات الخارجية: تُفتح في لسان جديد (انقر للفتح في نافذة جديدة)",
      external_mode_window: "الملفات الخارجية: تُفتح في نافذة جديدة (انقر للفتح في لسان جديد)",
      external_mode_menu_tab: "الملفات الخارجية: لسان جديد",
      external_mode_menu_win: "الملفات الخارجية: نافذة جديدة",
      external_mode_badge_tab: "لسان جديد",
      external_mode_badge_win: "نافذة جديدة",
      menu_external_mode: "الملفات الخارجية",
      menu_open_folder: "📁 فتح مجلد / مساحة عمل...",
      tabs_scroll_left_title: "تمرير لليسار",
      tabs_scroll_right_title: "تمرير لليمين",
      github_link_title: "مستودع GitHub",
      app_rate: "تقييم",
      rate_link_title: "تقييم في Microsoft Store",
      app_rated_thanks: "شكرًا لتقييمك!",
      toast_image_inserted: "تم إدراج الصورة: ",
      toast_image_file: "ملف الصورة: ",
      toast_image_saved: "تم حفظ الصورة: "
    },
    "hi": {
      tab_files: "फ़ाइलें",
      tab_files_title: "कार्यस्थान / फ़ाइलें",
      tab_outline: "रूपरेखा",
      tab_outline_title: "विषय सूची और आँकड़े",
      tab_search: "खोजें",
      tab_search_title: "दस्तावेज़ में खोजें (Ctrl+F)",
      no_folder_open: "कोई फ़ोल्डर नहीं खुला",
      refresh_folder_title: "ताज़ा करें (F5)",
      open_file_btn: "फ़ाइल खोलें",
      open_folder_btn: "फ़ोल्डर चुनें",
      folder_tree_empty_hint: "अपने नोट्स और फ़ाइलों को ट्री व्यू में देखने के लिए फ़ोल्डर चुनें।",
      new_tab_title: "नया दस्तावेज़ (Ctrl+N, Ctrl+T)",
      close_tab_title: "बंद करें (Ctrl+W)",
      untitled_doc: "शीर्षकहीन",
      stat_title: "दस्तावेज़ आँकड़े",
      stat_words: "शब्द",
      stat_chars: "अक्षर",
      stat_reading_time: "पढ़ने का समय",
      stat_time_unit: "मिनट",
      stat_path: "फ़ाइल पथ",
      search_placeholder: "दस्तावेज़ में खोजें (Ctrl+F)...",
      search_prev_title: "पिछला परिणाम (Shift+Enter)",
      search_next_title: "अगला परिणाम (Enter)",
      search_no_match: "कोई परिणाम नहीं मिला",
      search_matches: "परिणाम",
      toc_empty: "दस्तावेज़ में कोई शीर्षक नहीं मिला।",
      width_mode: "पढ़ने की चौड़ाई / लेआउट",
      width_narrow: "संक्षिप्त",
      width_readable: "पठनीय",
      width_readable_title: "आँखों के आराम के लिए आदर्श पंक्ति लंबाई (~65–75 वर्ण)",
      width_comfortable: "सहज",
      width_wide: "चौड़ा",
      width_full: "पूर्ण स्क्रीन",
      theme_toggle_title: "थीम बदलें (डार्क / OLED / लाइट) (Alt+Shift+T)",
      sidebar_toggle_title: "साइडबार दिखाएं/छिपाएं (Alt+Shift+B)",
      menu_more_title: "विकल्प",
      menu_lang: "भाषा",
      menu_scale: "यूआई स्केल",
      menu_scale_dec: "यूआई छोटा करें",
      menu_scale_inc: "यूआई बड़ा करें",
      menu_font: "फ़ॉन्ट आकार",
      menu_font_dec: "फ़ॉन्ट छोटा करें",
      menu_font_inc: "फ़ॉन्ट बड़ा करें",
      menu_save_as: "इस रूप में सहेजें...",
      menu_copy_html: "प्रारूपित HTML कॉपी करें",
      menu_print: "प्रिंट / PDF निर्यात करें...",
      app_desc: "मार्कडाउन और टेक्स्ट व्यूअर",
      copy_code_btn: "कॉपी करें",
      copied_text: "कॉपी हो गया!",
      copy_html_alert: "प्रारूपित HTML क्लिपबोर्ड में कॉपी किया गया!",
      edit_mode: "संपादन मोड (Ctrl+E)",
      save_btn: "सहेजें",
      save_btn_title: "परिवर्तन सहेजें (Ctrl+S)",
      save_confirm_prompt: "क्या आप इस दस्तावेज़ में किए गए परिवर्तनों को सहेजना चाहते हैं?",
      btn_yes: "सहेजें",
      btn_no: "न सहेजें",
      btn_cancel: "रद्द करें",
      saved_toast: "परिवर्तन सफलतापूर्वक सहेजे गए!",
      doc_up_to_date: "दस्तावेज़ पहले से ही अद्यतित है।",
      tool_h1: "शीर्षक 1 (Ctrl+1)",
      tool_h2: "शीर्षक 2 (Ctrl+2)",
      tool_bold: "बोल्ड (Ctrl+B)",
      tool_italic: "इटैलिक (Ctrl+I)",
      tool_ul: "बुलेट सूची",
      tool_bullet_dash: "डैश",
      tool_bullet_dot: "डॉट",
      tool_bullet_numbered: "क्रमांकित",
      tool_ol: "क्रमांकित सूची",
      tool_quote: "उद्धरण / इंडेंट",
      tool_code: "कोड ब्लॉक",
      tool_raw: "रॉ मार्कडाउन संपादक",
      menu_convert_txt: "TXT में बदलें...",
      menu_convert_md: "MD में बदलें...",
      convert_md_txt_warn: "सादा टेक्स्ट में बदलने पर मार्कडाउन प्रारूप खो सकता है। आप इसे कैसे सहेजना चाहते हैं?",
      convert_rendered_opt: "प्रारूपित टेक्स्ट",
      convert_raw_opt: "रॉ मार्कडाउन",
      convert_success_toast: "दस्तावेज़ सफलतापूर्वक परिवर्तित किया गया!",
      empty_title: "शुरुआत करें",
      empty_desc: "काम शुरू करने के लिए नया दस्तावेज़ बनाएं या मौजूदा फ़ाइल खोलें।",
      empty_btn_new: "नया दस्तावेज़ (Ctrl+N)",
      empty_btn_open: "फ़ाइल खोलें...",
      empty_hint: "💡 सुझाव: फ़ाइल को यहाँ ड्रैग-ड्रॉप करें या फ़ोल्डर ट्री से चुनें।",
      tabs_dropdown_title: "सभी खुले टैब",
      tabs_search_placeholder: "खुले टैब खोजें...",
      external_mode_tab: "बाहरी फ़ाइलें: नए टैब में खुलेंगी (नई विंडो के लिए क्लिक करें)",
      external_mode_window: "बाहरी फ़ाइलें: नई विंडो में खुलेंगी (नए टैब के लिए क्लिक करें)",
      external_mode_menu_tab: "बाहरी फ़ाइलें: नया टैब",
      external_mode_menu_win: "बाहरी फ़ाइलें: नई विंडो",
      external_mode_badge_tab: "नया टैब",
      external_mode_badge_win: "नई विंडो",
      menu_external_mode: "बाहरी फ़ाइलें",
      menu_open_folder: "📁 फ़ोल्डर / कार्यस्थान खोलें...",
      tabs_scroll_left_title: "बाएँ स्क्रॉल करें",
      tabs_scroll_right_title: "दाएँ स्क्रॉल करें",
      github_link_title: "GitHub रिपॉजिटरी",
      app_rate: "रेट करें",
      rate_link_title: "Microsoft Store में रेट करें",
      app_rated_thanks: "रेट करने के लिए धन्यवाद!",
      toast_image_inserted: "छवि डाली गई: ",
      toast_image_file: "छवि फ़ाइल: ",
      toast_image_saved: "छवि सहेजी गई: "
    },
    "ja": {
      tab_files: "ファイル",
      tab_files_title: "ワークスペース / ファイル",
      tab_outline: "目次",
      tab_outline_title: "目次とドキュメント統計",
      tab_search: "検索",
      tab_search_title: "ドキュメント内を検索 (Ctrl+F)",
      no_folder_open: "フォルダーが開かれていません",
      refresh_folder_title: "更新 (F5)",
      open_file_btn: "ファイルを開く",
      open_folder_btn: "フォルダーを選択",
      folder_tree_empty_hint: "フォルダーを選択すると、ノートやファイルをツリー形式で表示できます。",
      new_tab_title: "新規ドキュメント (Ctrl+N, Ctrl+T)",
      close_tab_title: "閉じる (Ctrl+W)",
      untitled_doc: "無題のドキュメント",
      stat_title: "ドキュメント統計",
      stat_words: "単語数",
      stat_chars: "文字数",
      stat_reading_time: "読了目安",
      stat_time_unit: "分",
      stat_path: "ファイルパス",
      search_placeholder: "ドキュメント内を検索 (Ctrl+F)...",
      search_prev_title: "前の一致 (Shift+Enter)",
      search_next_title: "次の一致 (Enter)",
      search_no_match: "一致する項目はありません",
      search_matches: "件の一致",
      toc_empty: "見出しが見つかりません。",
      width_mode: "表示幅 / レイアウト",
      width_narrow: "コンパクト",
      width_readable: "標準（読みやすい）",
      width_readable_title: "目の疲れを防ぐ最適な行長 (~65–75文字)",
      width_comfortable: "ゆったり",
      width_wide: "ワイド",
      width_full: "全画面",
      theme_toggle_title: "テーマ切り替え (ダーク / OLED / ライト) (Alt+Shift+T)",
      sidebar_toggle_title: "サイドバーの表示切替 (Alt+Shift+B)",
      menu_more_title: "オプション",
      menu_lang: "言語",
      menu_scale: "UI拡大率",
      menu_scale_dec: "UIを縮小",
      menu_scale_inc: "UIを拡大",
      menu_font: "文字サイズ",
      menu_font_dec: "文字を縮小",
      menu_font_inc: "文字を拡大",
      menu_save_as: "名前を付けて保存...",
      menu_copy_html: "装飾付きHTMLとしてコピー",
      menu_print: "印刷 / PDF出力...",
      app_desc: "Markdown ＆ テキストビューアー",
      copy_code_btn: "コピー",
      copied_text: "コピー完了！",
      copy_html_alert: "装飾済みHTMLをクリップボードにコピーしました！",
      edit_mode: "編集モード (Ctrl+E)",
      save_btn: "保存",
      save_btn_title: "変更を保存 (Ctrl+S)",
      save_confirm_prompt: "このドキュメントの変更内容を保存しますか？",
      btn_yes: "保存する",
      btn_no: "保存しない",
      btn_cancel: "キャンセル",
      saved_toast: "変更が正常に保存されました！",
      doc_up_to_date: "ドキュメントは最新の状態です。",
      tool_h1: "見出し 1 (Ctrl+1)",
      tool_h2: "見出し 2 (Ctrl+2)",
      tool_bold: "太字 (Ctrl+B)",
      tool_italic: "斜体 (Ctrl+I)",
      tool_ul: "箇条書きリスト",
      tool_bullet_dash: "ダッシュ (-)",
      tool_bullet_dot: "点 (•)",
      tool_bullet_numbered: "連番付き",
      tool_ol: "番号付きリスト",
      tool_quote: "引用 / インデント",
      tool_code: "コードブロック",
      tool_raw: "Markdownソース編集",
      menu_convert_txt: "TXT形式に変換...",
      menu_convert_md: "MD形式に変換...",
      convert_md_txt_warn: "プレーンテキストへ移行するとMarkdownの装飾が失われる可能性があります。どのように保存しますか？",
      convert_rendered_opt: "装飾済みテキスト",
      convert_raw_opt: "生Markdownコード",
      convert_success_toast: "ドキュメントの変換に成功しました！",
      empty_title: "はじめに",
      empty_desc: "作業を開始するには、新規ドキュメントを作成するかファイルを開いてください。",
      empty_btn_new: "新規ドキュメント (Ctrl+N)",
      empty_btn_open: "ファイルを開く...",
      empty_hint: "💡 ヒント: ここにファイルをドラッグ＆ドロップするか、左のツリーから選択してください。",
      tabs_dropdown_title: "開いているすべてのタブ",
      tabs_search_placeholder: "タブを検索...",
      external_mode_tab: "外部ファイル: 新しいタブで開きます (新しいウィンドウで開くにはクリック)",
      external_mode_window: "外部ファイル: 新しいウィンドウで開きます (新しいタブで開くにはクリック)",
      external_mode_menu_tab: "外部ファイル: 新規タブ",
      external_mode_menu_win: "外部ファイル: 新規ウィンドウ",
      external_mode_badge_tab: "新規タブ",
      external_mode_badge_win: "新規ウィンドウ",
      menu_external_mode: "外部ファイル",
      menu_open_folder: "📁 フォルダー / ワークスペースを開く...",
      tabs_scroll_left_title: "左へスクロール",
      tabs_scroll_right_title: "右へスクロール",
      github_link_title: "GitHub リポジトリ",
      app_rate: "評価",
      rate_link_title: "Microsoft Storeで評価",
      app_rated_thanks: "評価ありがとうございます！",
      toast_image_inserted: "画像を挿入しました: ",
      toast_image_file: "画像ファイル: ",
      toast_image_saved: "画像を保存しました: "
    },
    "zh": {
      tab_files: "文件",
      tab_files_title: "工作区 / 文件",
      tab_outline: "大纲",
      tab_outline_title: "目录与文档统计",
      tab_search: "搜索",
      tab_search_title: "文档内搜索 (Ctrl+F)",
      no_folder_open: "未打开文件夹",
      refresh_folder_title: "刷新 (F5)",
      open_file_btn: "打开文件",
      open_folder_btn: "选择文件夹",
      folder_tree_empty_hint: "选择一个文件夹，即可在树状目录中浏览文档与笔记。",
      new_tab_title: "新建文档 (Ctrl+N, Ctrl+T)",
      close_tab_title: "关闭 (Ctrl+W)",
      untitled_doc: "无标题文档",
      stat_title: "文档统计",
      stat_words: "字数",
      stat_chars: "字符数",
      stat_reading_time: "阅读时长",
      stat_time_unit: "分钟",
      stat_path: "文件路径",
      search_placeholder: "在文档中搜索 (Ctrl+F)...",
      search_prev_title: "上一处匹配 (Shift+Enter)",
      search_next_title: "下一处匹配 (Enter)",
      search_no_match: "未找到匹配项",
      search_matches: "处匹配",
      toc_empty: "文档中未检测到标题。",
      width_mode: "阅读宽度 / 版面布局",
      width_narrow: "紧凑",
      width_readable: "适中（舒适阅读）",
      width_readable_title: "防止眼疲劳的理想行宽 (~65–75个字符)",
      width_comfortable: "宽松",
      width_wide: "宽屏",
      width_full: "全屏",
      theme_toggle_title: "切换主题 (深色 / OLED纯黑 / 浅色) (Alt+Shift+T)",
      sidebar_toggle_title: "显示/隐藏侧边栏 (Alt+Shift+B)",
      menu_more_title: "更多选项",
      menu_lang: "语言",
      menu_scale: "界面缩放",
      menu_scale_dec: "缩小界面",
      menu_scale_inc: "放大界面",
      menu_font: "字体大小",
      menu_font_dec: "减小字体",
      menu_font_inc: "增大字体",
      menu_save_as: "另存为...",
      menu_copy_html: "复制为带格式 HTML",
      menu_print: "打印 / 导出为 PDF...",
      app_desc: "Markdown 与纯文本极简阅读器",
      copy_code_btn: "复制",
      copied_text: "已复制！",
      copy_html_alert: "已将格式化 HTML 复制到剪贴板！",
      edit_mode: "编辑模式 (Ctrl+E)",
      save_btn: "保存",
      save_btn_title: "保存更改 (Ctrl+S)",
      save_confirm_prompt: "是否保存对此文档的更改？",
      btn_yes: "保存",
      btn_no: "不保存",
      btn_cancel: "取消",
      saved_toast: "更改已成功保存！",
      doc_up_to_date: "文档已是最新状态。",
      tool_h1: "一级标题 (Ctrl+1)",
      tool_h2: "二级标题 (Ctrl+2)",
      tool_bold: "粗体 (Ctrl+B)",
      tool_italic: "斜体 (Ctrl+I)",
      tool_ul: "无序列表",
      tool_bullet_dash: "短划线 (-)",
      tool_bullet_dot: "圆点 (•)",
      tool_bullet_numbered: "数字编号",
      tool_ol: "有序列表",
      tool_quote: "引用 / 缩进",
      tool_code: "代码块",
      tool_raw: "纯文本源码编辑器",
      menu_convert_txt: "转换为 TXT 纯文本...",
      menu_convert_md: "转换为 MD 格式...",
      convert_md_txt_warn: "转为纯文本可能会丢失 Markdown 排版格式。您希望如何保存？",
      convert_rendered_opt: "格式化文本",
      convert_raw_opt: "原始 Markdown 源码",
      convert_success_toast: "文档转换成功！",
      empty_title: "开始使用",
      empty_desc: "新建一个文档或打开现有文件即可开始阅读与编辑。",
      empty_btn_new: "新建文档 (Ctrl+N)",
      empty_btn_open: "打开文件...",
      empty_hint: "💡 提示：可直接拖放文件到此处，或在左侧目录树中选择。",
      tabs_dropdown_title: "全部已打开标签页",
      tabs_search_placeholder: "搜索标签页...",
      external_mode_tab: "外部文件：在当前窗口作为新标签页打开（点击切换为新窗口）",
      external_mode_window: "外部文件：在独立新窗口打开（点击切换为新标签页）",
      external_mode_menu_tab: "外部文件：新标签页",
      external_mode_menu_win: "外部文件：新窗口",
      external_mode_badge_tab: "新标签页",
      external_mode_badge_win: "新窗口",
      menu_external_mode: "外部文件",
      menu_open_folder: "📁 打开文件夹 / 工作区...",
      tabs_scroll_left_title: "向左滚动",
      tabs_scroll_right_title: "向右滚动",
      github_link_title: "GitHub 开源仓库",
      app_rate: "评分",
      rate_link_title: "在 Microsoft Store 评分",
      app_rated_thanks: "感谢您的评分！",
      toast_image_inserted: "已插入图片: ",
      toast_image_file: "图片文件: ",
      toast_image_saved: "图片已保存: "
    },
    "zh-TW": {
      tab_files: "檔案",
      tab_files_title: "工作區 / 檔案",
      tab_outline: "大綱",
      tab_outline_title: "目錄與文件統計",
      tab_search: "搜尋",
      tab_search_title: "文件內搜尋 (Ctrl+F)",
      no_folder_open: "未開啟資料夾",
      refresh_folder_title: "重新整理 (F5)",
      open_file_btn: "開啟檔案",
      open_folder_btn: "選擇資料夾",
      folder_tree_empty_hint: "選取資料夾以樹狀目錄檢視您的文件與筆記。",
      new_tab_title: "新增文件 (Ctrl+N, Ctrl+T)",
      close_tab_title: "關閉 (Ctrl+W)",
      untitled_doc: "無標題文件",
      stat_title: "文件統計",
      stat_words: "字數",
      stat_chars: "字元數",
      stat_reading_time: "預計閱讀時間",
      stat_time_unit: "分鐘",
      stat_path: "檔案路徑",
      search_placeholder: "在文件中搜尋 (Ctrl+F)...",
      search_prev_title: "上一筆符合 (Shift+Enter)",
      search_next_title: "下一筆符合 (Enter)",
      search_no_match: "查無相符項目",
      search_matches: "筆相符",
      toc_empty: "文件中未發現任何標題。",
      width_mode: "閱讀寬度 / 頁面配置",
      width_narrow: "緊湊",
      width_readable: "適中（舒適閱讀）",
      width_readable_title: "避免眼睛疲勞的理想行長 (~65–75字元)",
      width_comfortable: "寬鬆",
      width_wide: "寬螢幕",
      width_full: "全螢幕",
      theme_toggle_title: "切換佈景主題 (深色 / OLED純黑 / 淺色) (Alt+Shift+T)",
      sidebar_toggle_title: "顯示/隱藏側邊欄 (Alt+Shift+B)",
      menu_more_title: "選項",
      menu_lang: "語言",
      menu_scale: "介面縮放",
      menu_scale_dec: "縮小介面",
      menu_scale_inc: "放大介面",
      menu_font: "文字大小",
      menu_font_dec: "縮小字體",
      menu_font_inc: "放大字體",
      menu_save_as: "另存新檔...",
      menu_copy_html: "複製為格式化 HTML",
      menu_print: "列印 / 匯出為 PDF...",
      app_desc: "Markdown 與文字閱讀器",
      copy_code_btn: "複製",
      copied_text: "已複製！",
      copy_html_alert: "已將格式化 HTML 複製到剪貼簿！",
      edit_mode: "編輯模式 (Ctrl+E)",
      save_btn: "儲存",
      save_btn_title: "儲存變更 (Ctrl+S)",
      save_confirm_prompt: "是否儲存對此文件的變更？",
      btn_yes: "儲存",
      btn_no: "不儲存",
      btn_cancel: "取消",
      saved_toast: "變更已成功儲存！",
      doc_up_to_date: "文件已為最新版本。",
      tool_h1: "標題 1 (Ctrl+1)",
      tool_h2: "標題 2 (Ctrl+2)",
      tool_bold: "粗體 (Ctrl+B)",
      tool_italic: "斜體 (Ctrl+I)",
      tool_ul: "項目符號清單",
      tool_bullet_dash: "破折號 (-)",
      tool_bullet_dot: "圓點 (•)",
      tool_bullet_numbered: "數字編號",
      tool_ol: "編號清單",
      tool_quote: "引言 / 縮排",
      tool_code: "程式碼區塊",
      tool_raw: "純文字 Markdown 編輯器",
      menu_convert_txt: "轉換為 TXT 純文字...",
      menu_convert_md: "轉換為 MD 格式...",
      convert_md_txt_warn: "切換為純文字可能會失去 Markdown 排版。您要如何儲存？",
      convert_rendered_opt: "格式化文字",
      convert_raw_opt: "原始 Markdown 碼",
      convert_success_toast: "文件轉換成功！",
      empty_title: "開始使用",
      empty_desc: "建立新文件或開啟檔案即可開始使用。",
      empty_btn_new: "新增文件 (Ctrl+N)",
      empty_btn_open: "開啟檔案...",
      empty_hint: "💡 提示：可將檔案拖放至此，或從左側目錄樹選取。",
      tabs_dropdown_title: "所有開啟的分頁",
      tabs_search_placeholder: "搜尋分頁...",
      external_mode_tab: "外部檔案：在當前視窗作為新分頁開啟（按一下切換為新視窗）",
      external_mode_window: "外部檔案：在獨立新視窗開啟（按一下切換為新分頁）",
      external_mode_menu_tab: "外部檔案：新分頁",
      external_mode_menu_win: "外部檔案：新視窗",
      external_mode_badge_tab: "新分頁",
      external_mode_badge_win: "新視窗",
      menu_external_mode: "外部檔案",
      menu_open_folder: "📁 開啟資料夾 / 工作區...",
      tabs_scroll_left_title: "向左捲動",
      tabs_scroll_right_title: "向右捲動",
      github_link_title: "GitHub 儲存庫",
      app_rate: "評分",
      rate_link_title: "在 Microsoft Store 評分",
      app_rated_thanks: "感謝您的評分！",
      toast_image_inserted: "已插入圖片: ",
      toast_image_file: "圖片檔案: ",
      toast_image_saved: "圖片已儲存: "
    },
    "ko": {
      tab_files: "파일",
      tab_files_title: "작업 공간 / 파일",
      tab_outline: "개요",
      tab_outline_title: "목차 및 문서 통계",
      tab_search: "검색",
      tab_search_title: "문서 내 검색 (Ctrl+F)",
      no_folder_open: "열린 폴더 없음",
      refresh_folder_title: "새로고침 (F5)",
      open_file_btn: "파일 열기",
      open_folder_btn: "폴더 선택",
      folder_tree_empty_hint: "노트와 파일을 트리 보기로 확인하려면 폴더를 선택하세요.",
      new_tab_title: "새 문서 (Ctrl+N, Ctrl+T)",
      close_tab_title: "닫기 (Ctrl+W)",
      untitled_doc: "제목 없음",
      stat_title: "문서 통계",
      stat_words: "단어 수",
      stat_chars: "글자 수",
      stat_reading_time: "예상 읽기 시간",
      stat_time_unit: "분",
      stat_path: "파일 경로",
      search_placeholder: "문서 내 검색 (Ctrl+F)...",
      search_prev_title: "이전 일치 항목 (Shift+Enter)",
      search_next_title: "다음 일치 항목 (Enter)",
      search_no_match: "일치하는 항목 없음",
      search_matches: "개 일치",
      toc_empty: "문서에서 제목을 찾을 수 없습니다.",
      width_mode: "읽기 너비 / 레이아웃",
      width_narrow: "좁게",
      width_readable: "읽기 편함",
      width_readable_title: "눈의 피로를 덜어주는 최적 줄 길이 (~65–75자)",
      width_comfortable: "편안하게",
      width_wide: "넓게",
      width_full: "전체 화면",
      theme_toggle_title: "테마 전환 (다크 / OLED / 라이트) (Alt+Shift+T)",
      sidebar_toggle_title: "사이드바 표시/숨기기 (Alt+Shift+B)",
      menu_more_title: "옵션",
      menu_lang: "언어",
      menu_scale: "UI 크기 비율",
      menu_scale_dec: "UI 축소",
      menu_scale_inc: "UI 확대",
      menu_font: "글꼴 크기",
      menu_font_dec: "글꼴 축소",
      menu_font_inc: "글꼴 확대",
      menu_save_as: "다른 이름으로 저장...",
      menu_copy_html: "서식 있는 HTML로 복사",
      menu_print: "인쇄 / PDF로 내보내기...",
      app_desc: "Markdown 및 텍스트 뷰어",
      copy_code_btn: "복사",
      copied_text: "복사됨!",
      copy_html_alert: "서식 있는 HTML이 클립보드에 복사되었습니다!",
      edit_mode: "편집 모드 (Ctrl+E)",
      save_btn: "저장",
      save_btn_title: "변경사항 저장 (Ctrl+S)",
      save_confirm_prompt: "이 문서의 변경사항을 저장하시겠습니까?",
      btn_yes: "저장",
      btn_no: "저장 안 함",
      btn_cancel: "취소",
      saved_toast: "변경사항이 성공적으로 저장되었습니다!",
      doc_up_to_date: "문서가 이미 최신 상태입니다.",
      tool_h1: "제목 1 (Ctrl+1)",
      tool_h2: "제목 2 (Ctrl+2)",
      tool_bold: "굵게 (Ctrl+B)",
      tool_italic: "기울임꼴 (Ctrl+I)",
      tool_ul: "글머리 기호 목록",
      tool_bullet_dash: "대시 (-)",
      tool_bullet_dot: "점 (•)",
      tool_bullet_numbered: "번호 매기기",
      tool_ol: "번호 매기기 목록",
      tool_quote: "인용 / 들여쓰기",
      tool_code: "코드 블록",
      tool_raw: "순수 Markdown 편집기",
      menu_convert_txt: "TXT로 변환...",
      menu_convert_md: "MD로 변환...",
      convert_md_txt_warn: "일반 텍스트로 변환 시 서식이 손실될 수 있습니다. 어떻게 저장하시겠습니까?",
      convert_rendered_opt: "서식 있는 텍스트",
      convert_raw_opt: "원시 Markdown 코드",
      convert_success_toast: "문서 변환 완료!",
      empty_title: "시작하기",
      empty_desc: "작업을 시작하려면 새 문서를 만들거나 파일을 여세요.",
      empty_btn_new: "새 문서 (Ctrl+N)",
      empty_btn_open: "파일 열기...",
      empty_hint: "💡 힌트: 파일을 여기로 드래그 앤 드롭하거나 폴더 트리에서 선택하세요.",
      tabs_dropdown_title: "열려 있는 모든 탭",
      tabs_search_placeholder: "열린 탭 검색...",
      external_mode_tab: "외부 파일: 새 탭으로 열립니다 (새 창으로 전환하려면 클릭)",
      external_mode_window: "외부 파일: 새 창으로 열립니다 (새 탭으로 전환하려면 클릭)",
      external_mode_menu_tab: "외부 파일: 새 탭",
      external_mode_menu_win: "외부 파일: 새 창",
      external_mode_badge_tab: "새 탭",
      external_mode_badge_win: "새 창",
      menu_external_mode: "외부 파일",
      menu_open_folder: "📁 폴더 / 작업 공간 열기...",
      tabs_scroll_left_title: "왼쪽으로 스크롤",
      tabs_scroll_right_title: "오른쪽으로 스크롤",
      github_link_title: "GitHub 저장소",
      app_rate: "평가",
      rate_link_title: "Microsoft Store에서 평가",
      app_rated_thanks: "평가해 주셔서 감사합니다!",
      toast_image_inserted: "이미지 삽입됨: ",
      toast_image_file: "이미지 파일: ",
      toast_image_saved: "이미지 저장됨: "
    },
    "id": {
      tab_files: "Berkas",
      tab_files_title: "Ruang Kerja / Berkas",
      tab_outline: "Kerangka",
      tab_outline_title: "Daftar Isi & Statistik",
      tab_search: "Cari",
      tab_search_title: "Cari dalam dokumen (Ctrl+F)",
      no_folder_open: "Tidak ada folder terbuka",
      refresh_folder_title: "Segarkan (F5)",
      open_file_btn: "Buka Berkas",
      open_folder_btn: "Pilih Folder",
      folder_tree_empty_hint: "Pilih folder untuk melihat catatan dan berkas Anda dalam bentuk pohon.",
      new_tab_title: "Dokumen Baru (Ctrl+N, Ctrl+T)",
      close_tab_title: "Tutup (Ctrl+W)",
      untitled_doc: "Tanpa Judul",
      stat_title: "Statistik Dokumen",
      stat_words: "Kata",
      stat_chars: "Karakter",
      stat_reading_time: "Waktu Baca",
      stat_time_unit: "mnt",
      stat_path: "Lokasi Berkas",
      search_placeholder: "Cari dalam dokumen (Ctrl+F)...",
      search_prev_title: "Kecocokan Sebelumnya (Shift+Enter)",
      search_next_title: "Kecocokan Berikutnya (Enter)",
      search_no_match: "Tidak ada kecocokan",
      search_matches: "kecocokan",
      toc_empty: "Tidak ditemukan judul di dalam dokumen.",
      width_mode: "Lebar Baca / Tata Letak",
      width_narrow: "Kompak",
      width_readable: "Nyaman Dibaca",
      width_readable_title: "Panjang baris ideal agar mata tidak lelah (~65–75 karakter)",
      width_comfortable: "Leluasa",
      width_wide: "Lebar",
      width_full: "Layar Penuh",
      theme_toggle_title: "Ganti Tema (Gelap / OLED / Terang) (Alt+Shift+T)",
      sidebar_toggle_title: "Buka/Tutup Bilah Sisi (Alt+Shift+B)",
      menu_more_title: "Opsi",
      menu_lang: "Bahasa",
      menu_scale: "Skala Antarmuka",
      menu_scale_dec: "Perkecil Antarmuka",
      menu_scale_inc: "Perbesar Antarmuka",
      menu_font: "Ukuran Teks",
      menu_font_dec: "Kecilkan Teks",
      menu_font_inc: "Besarkan Teks",
      menu_save_as: "Simpan Sebagai...",
      menu_copy_html: "Salin sebagai HTML Berformat",
      menu_print: "Cetak / Ekspor ke PDF...",
      app_desc: "Penampil Markdown & Teks",
      copy_code_btn: "Salin",
      copied_text: "Tersalin!",
      copy_html_alert: "HTML berformat disalin ke papan klip!",
      edit_mode: "Mode Edit (Ctrl+E)",
      save_btn: "Simpan",
      save_btn_title: "Simpan Perubahan (Ctrl+S)",
      save_confirm_prompt: "Apakah Anda ingin menyimpan perubahan pada dokumen ini?",
      btn_yes: "Simpan",
      btn_no: "Jangan Simpan",
      btn_cancel: "Batal",
      saved_toast: "Perubahan berhasil disimpan!",
      doc_up_to_date: "Dokumen sudah versi terbaru.",
      tool_h1: "Judul 1 (Ctrl+1)",
      tool_h2: "Judul 2 (Ctrl+2)",
      tool_bold: "Tebal (Ctrl+B)",
      tool_italic: "Miring (Ctrl+I)",
      tool_ul: "Daftar Poin",
      tool_bullet_dash: "Setrip",
      tool_bullet_dot: "Titik",
      tool_bullet_numbered: "Bernomor",
      tool_ol: "Daftar Bernomor",
      tool_quote: "Kutipan / Indentasi",
      tool_code: "Blok Kode",
      tool_raw: "Editor Kode Mentah Markdown",
      menu_convert_txt: "Konversi ke TXT...",
      menu_convert_md: "Konversi ke MD...",
      convert_md_txt_warn: "Pemformatan mungkin hilang saat beralih ke teks polos. Bagaimana Anda ingin menyimpannya?",
      convert_rendered_opt: "Teks Berformat",
      convert_raw_opt: "Markdown Mentah",
      convert_success_toast: "Dokumen berhasil dikonversi!",
      empty_title: "Memulai",
      empty_desc: "Buat dokumen baru atau buka berkas untuk mulai bekerja.",
      empty_btn_new: "Dokumen Baru (Ctrl+N)",
      empty_btn_open: "Buka Berkas...",
      empty_hint: "💡 Tips: Tarik dan lepas berkas ke sini atau pilih dari pohon folder.",
      tabs_dropdown_title: "Semua Tab Terbuka",
      tabs_search_placeholder: "Cari tab yang terbuka...",
      external_mode_tab: "Berkas eksternal: Dibuka sebagai tab baru (Klik untuk Jendela Baru)",
      external_mode_window: "Berkas eksternal: Dibuka di jendela baru (Klik untuk Tab Baru)",
      external_mode_menu_tab: "Berkas Eksternal: Tab Baru",
      external_mode_menu_win: "Berkas Eksternal: Jendela Baru",
      external_mode_badge_tab: "Tab Baru",
      external_mode_badge_win: "Jendela Baru",
      menu_external_mode: "Berkas Eksternal",
      menu_open_folder: "📁 Buka Folder / Ruang Kerja...",
      tabs_scroll_left_title: "Gulir ke Kiri",
      tabs_scroll_right_title: "Gulir ke Kanan",
      github_link_title: "Repositori GitHub",
      app_rate: "Beri Nilai",
      rate_link_title: "Beri nilai di Microsoft Store",
      app_rated_thanks: "Terima kasih telah menilai!",
      toast_image_inserted: "Gambar disisipkan: ",
      toast_image_file: "Berkas gambar: ",
      toast_image_saved: "Gambar disimpan: "
    },
    "vi": {
      tab_files: "Tệp tin",
      tab_files_title: "Không gian làm việc / Tệp tin",
      tab_outline: "Mục lục",
      tab_outline_title: "Mục lục & Thống kê tài liệu",
      tab_search: "Tìm kiếm",
      tab_search_title: "Tìm kiếm trong tài liệu (Ctrl+F)",
      no_folder_open: "Chưa mở thư mục",
      refresh_folder_title: "Làm mới (F5)",
      open_file_btn: "Mở tệp",
      open_folder_btn: "Chọn thư mục",
      folder_tree_empty_hint: "Chọn một thư mục để xem ghi chú và tệp tin theo dạng cây.",
      new_tab_title: "Tài liệu mới (Ctrl+N, Ctrl+T)",
      close_tab_title: "Đóng (Ctrl+W)",
      untitled_doc: "Chưa có tiêu đề",
      stat_title: "Thống kê tài liệu",
      stat_words: "Từ",
      stat_chars: "Ký tự",
      stat_reading_time: "Thời gian đọc",
      stat_time_unit: "phút",
      stat_path: "Đường dẫn tệp",
      search_placeholder: "Tìm trong tài liệu (Ctrl+F)...",
      search_prev_title: "Kết quả trước (Shift+Enter)",
      search_next_title: "Kết quả tiếp theo (Enter)",
      search_no_match: "Không tìm thấy kết quả",
      search_matches: "kết quả",
      toc_empty: "Không tìm thấy tiêu đề nào trong tài liệu.",
      width_mode: "Chiều rộng đọc / Bố cục",
      width_narrow: "Thu gọn",
      width_readable: "Dễ đọc",
      width_readable_title: "Độ dài dòng lý tưởng để chống mỏi mắt (~65–75 ký tự)",
      width_comfortable: "Thoải mái",
      width_wide: "Rộng",
      width_full: "Toàn màn hình",
      theme_toggle_title: "Chuyển giao diện (Tối / OLED / Sáng) (Alt+Shift+T)",
      sidebar_toggle_title: "Bật/Tắt thanh bên (Alt+Shift+B)",
      menu_more_title: "Tùy chọn",
      menu_lang: "Ngôn ngữ",
      menu_scale: "Tỷ lệ giao diện",
      menu_scale_dec: "Thu nhỏ giao diện",
      menu_scale_inc: "Phóng to giao diện",
      menu_font: "Cỡ chữ",
      menu_font_dec: "Giảm cỡ chữ",
      menu_font_inc: "Tăng cỡ chữ",
      menu_save_as: "Lưu dưới dạng...",
      menu_copy_html: "Sao chép dưới dạng HTML có định dạng",
      menu_print: "In / Xuất ra PDF...",
      app_desc: "Trình xem Markdown & Văn bản",
      copy_code_btn: "Sao chép",
      copied_text: "Đã sao chép!",
      copy_html_alert: "Đã sao chép mã HTML có định dạng vào khay nhớ tạm!",
      edit_mode: "Chế độ chỉnh sửa (Ctrl+E)",
      save_btn: "Lưu",
      save_btn_title: "Lưu thay đổi (Ctrl+S)",
      save_confirm_prompt: "Bạn có muốn lưu các thay đổi cho tài liệu này không?",
      btn_yes: "Lưu",
      btn_no: "Không lưu",
      btn_cancel: "Hủy",
      saved_toast: "Đã lưu thay đổi thành công!",
      doc_up_to_date: "Tài liệu đã ở trạng thái mới nhất.",
      tool_h1: "Tiêu đề 1 (Ctrl+1)",
      tool_h2: "Tiêu đề 2 (Ctrl+2)",
      tool_bold: "In đậm (Ctrl+B)",
      tool_italic: "In nghiêng (Ctrl+I)",
      tool_ul: "Danh sách dấu đầu dòng",
      tool_bullet_dash: "Gạch ngang",
      tool_bullet_dot: "Chấm tròn",
      tool_bullet_numbered: "Đánh số",
      tool_ol: "Danh sách đánh số",
      tool_quote: "Trích dẫn / Thụt lề",
      tool_code: "Khối mã",
      tool_raw: "Trình soạn thảo mã thô Markdown",
      menu_convert_txt: "Chuyển đổi sang TXT...",
      menu_convert_md: "Chuyển đổi sang MD...",
      convert_md_txt_warn: "Định dạng có thể bị mất khi chuyển sang văn bản thuần. Bạn muốn lưu như thế nào?",
      convert_rendered_opt: "Văn bản có định dạng",
      convert_raw_opt: "Mã Markdown thô",
      convert_success_toast: "Chuyển đổi tài liệu thành công!",
      empty_title: "Bắt đầu",
      empty_desc: "Tạo tài liệu mới hoặc mở tệp hiện có để bắt đầu.",
      empty_btn_new: "Tài liệu mới (Ctrl+N)",
      empty_btn_open: "Mở tệp...",
      empty_hint: "💡 Gợi ý: Bạn có thể kéo thả tệp vào đây hoặc chọn từ cây thư mục bên trái.",
      tabs_dropdown_title: "Tất cả các tab đang mở",
      tabs_search_placeholder: "Tìm kiếm các tab đang mở...",
      external_mode_tab: "Tệp bên ngoài: Mở dưới dạng thẻ mới (Nhấp để mở trong cửa sổ mới)",
      external_mode_window: "Tệp bên ngoài: Mở trong cửa sổ mới (Nhấp để mở dưới dạng thẻ mới)",
      external_mode_menu_tab: "Tệp bên ngoài: Thẻ mới",
      external_mode_menu_win: "Tệp bên ngoài: Cửa sổ mới",
      external_mode_badge_tab: "Thẻ mới",
      external_mode_badge_win: "Cửa sổ mới",
      menu_external_mode: "Tệp bên ngoài",
      menu_open_folder: "📁 Mở thư mục / Không gian làm việc...",
      tabs_scroll_left_title: "Cuộn sang trái",
      tabs_scroll_right_title: "Cuộn sang phải",
      github_link_title: "Kho lưu trữ GitHub",
      app_rate: "Đánh giá",
      rate_link_title: "Đánh giá trên Microsoft Store",
      app_rated_thanks: "Cảm ơn bạn đã đánh giá!",
      toast_image_inserted: "Đã chèn hình ảnh: ",
      toast_image_file: "Tệp hình ảnh: ",
      toast_image_saved: "Đã lưu hình ảnh: "
    },
    "az": {
      tab_files: "Fayllar",
      tab_files_title: "İş sahəsi / Fayllar",
      tab_outline: "Məzmun",
      tab_outline_title: "Mündəricat və statistika",
      tab_search: "Axtarış",
      tab_search_title: "Sənəd daxilində axtarış (Ctrl+F)",
      no_folder_open: "Qovluq açılmayıb",
      refresh_folder_title: "Yenilə (F5)",
      open_file_btn: "Fayl aç",
      open_folder_btn: "Qovluq seç",
      folder_tree_empty_hint: "Qeydlərinizi və fayllarınızı ağac şəklində görmək üçün qovluq seçin.",
      new_tab_title: "Yeni sənəd (Ctrl+N, Ctrl+T)",
      close_tab_title: "Bağla (Ctrl+W)",
      untitled_doc: "Yeni sənəd",
      stat_title: "Mətn statistikası",
      stat_words: "Söz",
      stat_chars: "Simvol",
      stat_reading_time: "Oxuma müddəti",
      stat_time_unit: "dəq",
      stat_path: "Fayl yolu",
      search_placeholder: "Sənəddə axtar (Ctrl+F)...",
      search_prev_title: "Əvvəlki uyğunluq (Shift+Enter)",
      search_next_title: "Növbəti uyğunluq (Enter)",
      search_no_match: "Uyğunluq tapılmadı",
      search_matches: "uyğunluq",
      toc_empty: "Sənəddə heç bir başlıq tapılmadı.",
      width_mode: "Oxuma eni / Səhifə düzəni",
      width_narrow: "Dar",
      width_readable: "Oxunaqlı",
      width_readable_title: "Göz yorğunluğunun qarşısını alan ideal sətir uzunluğu (~65–75 simvol)",
      width_comfortable: "Rahat",
      width_wide: "Geniş",
      width_full: "Tam ekran",
      theme_toggle_title: "Mövzunu dəyiş (Qaranlıq / OLED / İşıqlı) (Alt+Shift+T)",
      sidebar_toggle_title: "Yan paneli aç/bağla (Alt+Shift+B)",
      menu_more_title: "Seçimlər",
      menu_lang: "Dil",
      menu_scale: "İnterfeys miqyası",
      menu_scale_dec: "İnterfeysi kiçilt",
      menu_scale_inc: "İnterfeysi böyüt",
      menu_font: "Şrift ölçüsü",
      menu_font_dec: "Şrifti kiçilt",
      menu_font_inc: "Şrifti böyüt",
      menu_save_as: "Fərqli saxla...",
      menu_copy_html: "Formatlaşdırılmış HTML olaraq kopyala",
      menu_print: "Çap et / PDF kimi saxla...",
      app_desc: "Markdown və Mətn İzləyicisi",
      copy_code_btn: "Kopyala",
      copied_text: "Kopyalandı!",
      copy_html_alert: "Formatlaşdırılmış HTML buferə kopyalandı!",
      edit_mode: "Redaktə rejimi (Ctrl+E)",
      save_btn: "Yadda saxla",
      save_btn_title: "Dəyişiklikləri yadda saxla (Ctrl+S)",
      save_confirm_prompt: "Bu sənəddəki dəyişikliklər yadda saxlanılsın?",
      btn_yes: "Yadda saxla",
      btn_no: "Yadda saxlama",
      btn_cancel: "İmtina",
      saved_toast: "Dəyişikliklər uğurla yadda saxlanıldı!",
      doc_up_to_date: "Sənəd artıq yenidir.",
      tool_h1: "Başlıq 1 (Ctrl+1)",
      tool_h2: "Başlıq 2 (Ctrl+2)",
      tool_bold: "Qalın (Ctrl+B)",
      tool_italic: "Kursiv (Ctrl+I)",
      tool_ul: "Markerli siyahı",
      tool_bullet_dash: "Tire",
      tool_bullet_dot: "Nöqtə",
      tool_bullet_numbered: "Nömrələnmiş",
      tool_ol: "Nömrəli siyahı",
      tool_quote: "Sitat / Boşluq",
      tool_code: "Kod bloku",
      tool_raw: "Xam mətn redaktoru",
      menu_convert_txt: "TXT formatına çevir...",
      menu_convert_md: "MD formatına çevir...",
      convert_md_txt_warn: "TXT formatına keçərkən Markdown formatı itirilə bilər. Sənədi necə saxlamaq istəyirsiniz?",
      convert_rendered_opt: "Formatlaşdırılmış mətn",
      convert_raw_opt: "Xam Markdown kodu",
      convert_success_toast: "Sənəd uğurla çevrildi!",
      empty_title: "Başlarkən",
      empty_desc: "İşə başlamaq üçün yeni sənəd yaradın və ya mövcud faylı açın.",
      empty_btn_new: "Yeni sənəd (Ctrl+N)",
      empty_btn_open: "Fayl aç...",
      empty_hint: "💡 İpucu: Faylı bura sürükləyib buraxa və ya sol menyudan seçə bilərsiniz.",
      tabs_dropdown_title: "Bütün açıq vərəqlər",
      tabs_search_placeholder: "Açıq vərəqlərdə axtar...",
      external_mode_tab: "Xarici fayllar: Yeni vərəqdə açılır (Yeni Pəncərə üçün klikləyin)",
      external_mode_window: "Xarici fayllar: Yeni pəncərədə açılır (Yeni Vərəq üçün klikləyin)",
      external_mode_menu_tab: "Xarici fayllar: Yeni Vərəq",
      external_mode_menu_win: "Xarici fayllar: Yeni Pəncərə",
      external_mode_badge_tab: "Yeni Vərəq",
      external_mode_badge_win: "Yeni Pəncərə",
      menu_external_mode: "Xarici fayllar",
      menu_open_folder: "📁 Qovluq / İş sahəsi aç...",
      tabs_scroll_left_title: "Sola sürüşdür",
      tabs_scroll_right_title: "Sağa sürüşdür",
      github_link_title: "GitHub repozitoriyası",
      app_rate: "Qiymətləndir",
      rate_link_title: "Microsoft Store-da qiymətləndir",
      app_rated_thanks: "Qiymətləndirdiyiniz üçün təşəkkürlər!",
      toast_image_inserted: "Şəkil əlavə edildi: ",
      toast_image_file: "Şəkil faylı: ",
      toast_image_saved: "Şəkil yadda saxlanıldı: "
    }
  };

  // State
  const state = {
    theme: initialTheme,
    lang: savedLang,
    width: savedWidth,
    fontSize: parseInt(getStored('font_size', '16'), 10),
    uiScale: parseInt(getStored('ui_scale', '100'), 10),
    sidebarOpen: getStored('sidebar', 'true') !== 'false',
    isEditing: false,
    isRawMode: false,
    isDirty: false,
    originalRaw: '',
    rawMarkdown: '',
    filePath: '',
    fileName: 'Belge.md',
    lastModified: 0,
    searchMatches: [],
    currentSearchIdx: -1,
    headingPositions: [], // Cached offsets for zero-lag ScrollSpy
    // v2.0.0 Multi-Tab & Workspace
    tabs: [],
    activeTabId: null,
    draggedTabId: null,
    workspaceTree: null,
    workspaceFolderPath: (function() {
      const f = getStored('workspace_folder', '');
      if (f && (f.indexOf('WindowsApps') !== -1 || f.toLowerCase().endsWith('\\neotext') || f.toLowerCase().endsWith('/neotext'))) {
        setStored('workspace_folder', '');
        setStored('workspace_folder_name', '');
        return '';
      }
      return f;
    })(),
    workspaceFolderName: (function() {
      const f = getStored('workspace_folder', '');
      if (f && (f.indexOf('WindowsApps') !== -1 || f.toLowerCase().endsWith('\\neotext') || f.toLowerCase().endsWith('/neotext'))) {
        return '';
      }
      return getStored('workspace_folder_name', '') || (f ? (f.split(/[/\\]/).filter(Boolean).pop() || '') : '');
    })(),
    openExternalInTabs: getStored('external_open_mode', 'tab') !== 'window'
  };

  window.state = state;
  window.__NEOTEXT_STATE__ = window.__NEOMD_STATE__ = state;

  // DOM Elements
  const el = {
    appContainer: document.getElementById('app-container'),
    sidebar: document.getElementById('sidebar'),
    sidebarToggleBtn: document.getElementById('sidebar-toggle-btn'),
    documentTitle: document.getElementById('document-title'),
    viewport: document.getElementById('content-viewport'),
    markdownBody: document.getElementById('markdown-body'),
    tocList: document.getElementById('toc-list'),
    editBtn: document.getElementById('edit-btn'),
    floatingSaveBtn: document.getElementById('floating-save-btn'),
    editToolbar: document.getElementById('edit-toolbar'),
    rawEditor: document.getElementById('raw-editor'),
    toolBtns: document.querySelectorAll('.edit-tool-btn'),
    toolUlBtn: document.getElementById('tool-ul'),
    toolUlPopover: document.getElementById('tool-ul-popover'),
    toolPopoverItems: document.querySelectorAll('.tool-popover-item'),
    toolRawBtn: document.getElementById('tool-raw'),
    saveToast: document.getElementById('save-toast'),
    saveToastMsg: document.getElementById('save-toast-msg'),
    themeToggleBtn: document.getElementById('theme-toggle-btn'),
    themeIcon: document.getElementById('theme-icon'),
    widthPills: document.querySelectorAll('.width-pill'),
    tabBtns: document.querySelectorAll('.tab-btn'),
    sidebarPanes: document.querySelectorAll('.sidebar-pane'),
    // Integrated Header & Tabs Elements
    headerCenterArea: document.getElementById('header-center-area'),
    singleDocTitle: document.getElementById('single-doc-title'),
    headerTabsContainer: document.getElementById('header-tabs-container'),
    tabsScrollLeftBtn: document.getElementById('tabs-scroll-left-btn'),
    tabsScrollRightBtn: document.getElementById('tabs-scroll-right-btn'),
    tabsList: document.getElementById('tabs-list'),
    tabNewBtn: document.getElementById('tab-new-btn'),
    tabsDropdownBtn: document.getElementById('tabs-dropdown-btn'),
    tabsDropdownPopover: document.getElementById('tabs-dropdown-popover'),
    tabsSearchInput: document.getElementById('tabs-search-input'),
    tabsPopoverList: document.getElementById('tabs-popover-list'),
    menuExternalModeBtn: document.getElementById('menu-external-mode-btn'),
    externalModeLabel: document.getElementById('external-mode-label'),
    externalModeBadge: document.getElementById('external-mode-badge'),
    externalModeIcon: document.getElementById('external-mode-icon'),
    // Empty State Elements
    emptyStateView: document.getElementById('empty-state-view'),
    emptyStateCard: document.getElementById('empty-state-card'),
    emptyNewBtn: document.getElementById('empty-new-btn'),
    emptyOpenBtn: document.getElementById('empty-open-btn'),
    // Workspace Elements
    tabBtnFiles: document.getElementById('tab-btn-files'),
    tabPaneFiles: document.getElementById('tab-pane-files'),
    workspaceFolderName: document.getElementById('workspace-folder-name'),
    refreshWorkspaceBtn: document.getElementById('refresh-workspace-btn'),
    workspaceOpenFileBtn: document.getElementById('workspace-open-file-btn'),
    openWorkspaceBtn: document.getElementById('open-workspace-btn'),
    folderTreeRoot: document.getElementById('folder-tree-root'),
    menuOpenFolderBtn: document.getElementById('menu-open-folder-btn'),
    // Stats (Integrated in Outline)
    outlineStatsCard: document.getElementById('outline-stats-card'),
    statWords: document.getElementById('stat-words'),
    statChars: document.getElementById('stat-chars'),
    statTime: document.getElementById('stat-time'),
    statPath: document.getElementById('stat-path'),
    // Search
    searchInput: document.getElementById('search-input'),
    searchCount: document.getElementById('search-count'),
    searchPrevBtn: document.getElementById('search-prev-btn'),
    searchNextBtn: document.getElementById('search-next-btn'),
    searchResultsList: document.getElementById('search-results-list'),
    // Menu
    menuBtn: document.getElementById('menu-btn'),
    dropdownMenu: document.getElementById('dropdown-menu'),
    langSelect: document.getElementById('lang-select'),
    langCustomDropdown: document.getElementById('lang-custom-dropdown'),
    langDropdownTrigger: document.getElementById('lang-dropdown-trigger'),
    langDropdownMenu: document.getElementById('lang-dropdown-menu'),
    langCurrentLabel: document.getElementById('lang-current-label'),
    githubBtn: document.getElementById('github-link-btn'),
    coffeeBtn: document.getElementById('coffee-link-btn'),
    rateBtn: document.getElementById('rate-link-btn'),
    appInfoVersion: document.getElementById('app-info-version'),
    fontDecBtn: document.getElementById('font-dec-btn'),
    fontIncBtn: document.getElementById('font-inc-btn'),
    fontSizeDisplay: document.getElementById('font-size-display'),
    uiScaleDecBtn: document.getElementById('ui-scale-dec-btn'),
    uiScaleIncBtn: document.getElementById('ui-scale-inc-btn'),
    uiScaleDisplay: document.getElementById('ui-scale-display'),
    saveAsBtn: document.getElementById('save-as-btn'),
    convertDocBtn: document.getElementById('convert-doc-btn'),
    convertDocLabel: document.getElementById('convert-doc-label'),
    printBtn: document.getElementById('print-btn'),
    copyHtmlBtn: document.getElementById('copy-html-btn'),
    metaThemeColor: document.getElementById('meta-theme-color')
  };

  // Initialize
  function init() {
    applyTheme(state.theme);
    applyLanguage(state.lang);
    applyUiScale(state.uiScale || 100);
    applyWidth(state.width);
    applyFontSize(state.fontSize);
    applySidebar(state.sidebarOpen);

    // Channel-based UI adaptation (GitHub vs Store)
    const channel = window.__NEOTEXT_CHANNEL__ || 'github';
    if (channel === 'store') {
      if (el.coffeeBtn) el.coffeeBtn.style.display = 'inline-flex';
      if (el.rateBtn) {
        el.rateBtn.style.display = 'inline-flex';
        updateRateButtonState();
      }
    } else {
      if (el.coffeeBtn) el.coffeeBtn.style.display = 'inline-flex';
      if (el.rateBtn) el.rateBtn.style.display = 'none';
    }

    setupEventListeners();
    setupMarked();

    // v2.0.0 Systems
    initTabs();
    initWorkspace();
    initImagePasteHandler();

    // Load document data
    loadDocument();
    window.addEventListener('hashchange', loadDocument);

    // Start live reload watcher
    startFileWatcher();

    // Query parameter UI triggers (for showcase capture & deep linking)
    if (urlParams.get('open_menu') === '1' && el.dropdownMenu) {
      el.dropdownMenu.classList.add('show');
    }
    if (urlParams.get('open_lang') === '1' && el.langCustomDropdown) {
      if (el.dropdownMenu) el.dropdownMenu.classList.add('show');
      el.langCustomDropdown.classList.add('open');
    }

    const scrollTarget = urlParams.get('scroll');
    if (scrollTarget) {
      setTimeout(() => {
        let m = null;
        if (scrollTarget === 'math') {
          m = document.querySelector('.katex-display') || document.querySelector('h2:nth-of-type(3)');
        } else if (scrollTarget === 'mermaid') {
          m = document.querySelector('.language-mermaid') || document.querySelector('h2:nth-of-type(4)');
        } else if (scrollTarget === 'code') {
          m = document.querySelector('.language-csharp') || document.querySelector('pre') || document.querySelector('h2:nth-of-type(5)');
        } else if (scrollTarget === 'callouts') {
          m = document.querySelector('.callout') || document.querySelector('h2:nth-of-type(7)');
        }
        if (m) {
          m.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      }, 500);
    }
  }

  // Language Manager (i18n)
  function applyLanguage(lang) {
    window.applyLanguage = applyLanguage;
    if (!I18N[lang]) lang = 'en';
    state.lang = lang;
    setStored('lang', lang);

    const dict = I18N[lang];

    // Update html attributes
    document.documentElement.lang = lang;
    if (lang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.removeAttribute('dir');
    }

    // Sync select dropdown
    if (el.langSelect && el.langSelect.value !== lang) {
      el.langSelect.value = lang;
    }

    // Sync custom language dropdown
    const langNames = {
      ar: 'العربية',
      az: 'Azərbaycan dili',
      de: 'Deutsch',
      en: 'English',
      es: 'Español',
      fr: 'Français',
      hi: 'हिन्दी',
      id: 'Bahasa Indonesia',
      it: 'Italiano',
      ja: '日本語',
      ko: '한국어',
      nl: 'Nederlands',
      pl: 'Polski',
      pt: 'Português',
      ru: 'Русский',
      tr: 'Türkçe',
      uk: 'Українська',
      vi: 'Tiếng Việt',
      zh: '简体中文',
      'zh-TW': '繁體中文'
    };
    if (el.langCurrentLabel && langNames[lang]) {
      el.langCurrentLabel.textContent = langNames[lang];
    }
    if (el.langDropdownMenu) {
      el.langDropdownMenu.querySelectorAll('.custom-dropdown-item').forEach(item => {
        if (item.getAttribute('data-lang') === lang) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }

    // Update all text elements with data-i18n (except dynamic workspace folder name)
    document.querySelectorAll('[data-i18n]').forEach(elem => {
      if (elem.id === 'workspace-folder-name') return;
      const key = elem.getAttribute('data-i18n');
      if (dict[key]) {
        elem.textContent = dict[key];
      }
    });

    // Update dynamic workspace folder label (preserve loaded folder name)
    if (el.workspaceFolderName) {
      if (state.workspaceFolderName || state.workspaceFolderPath) {
        const folderDisplayName = state.workspaceFolderName || state.workspaceFolderPath.split(/[/\\]/).filter(Boolean).pop() || state.workspaceFolderPath;
        el.workspaceFolderName.textContent = folderDisplayName;
        el.workspaceFolderName.title = state.workspaceFolderPath || folderDisplayName;
      } else {
        el.workspaceFolderName.textContent = dict.no_folder_open || 'Klasör Açılmadı';
        el.workspaceFolderName.title = '';
      }
    }

    // Update all title attributes with data-i18n-title
    document.querySelectorAll('[data-i18n-title]').forEach(elem => {
      const key = elem.getAttribute('data-i18n-title');
      if (dict[key]) {
        elem.setAttribute('title', dict[key]);
      }
    });

    // Update all placeholder attributes with data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(elem => {
      const key = elem.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        elem.setAttribute('placeholder', dict[key]);
      }
    });

    // Reset and update all code copy buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn._copyRequestId = (btn._copyRequestId || 0) + 1;
      if (btn._copyTimeout) {
        clearTimeout(btn._copyTimeout);
        btn._copyTimeout = null;
      }
      btn.classList.remove('copied');
      btn.style.borderColor = '';
      btn.style.color = '';
      const svg = btn.querySelector('.copy-btn-icon') || btn.querySelector('svg');
      if (svg) {
        svg.innerHTML = '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>';
      }
      const span = btn.querySelector('.copy-btn-text') || btn.querySelector('span');
      if (span) {
        span.textContent = dict.copy_code_btn || 'Copy';
      }
    });

    // Update specific inputs/buttons titles & placeholders
    if (el.searchInput) {
      el.searchInput.placeholder = dict.search_placeholder || 'Metin ara (Ctrl+F)...';
    }
    if (el.searchPrevBtn) el.searchPrevBtn.title = dict.search_prev_title || 'Önceki (Shift+Enter)';
    if (el.searchNextBtn) el.searchNextBtn.title = dict.search_next_title || 'Sonraki (Enter)';
    if (el.sidebarToggleBtn) el.sidebarToggleBtn.title = dict.sidebar_toggle_title || 'Kenar Çubuğunu Aç/Kapat (Alt+Shift+B)';
    if (el.themeToggleBtn) el.themeToggleBtn.title = dict.theme_toggle_title || 'Toggle Dark / Light Theme (Alt+Shift+T)';
    if (el.menuBtn) el.menuBtn.title = dict.menu_more_title || 'Options';
    if (el.uiScaleDecBtn) el.uiScaleDecBtn.title = dict.menu_scale_dec || 'Zoom Out UI';
    if (el.uiScaleIncBtn) el.uiScaleIncBtn.title = dict.menu_scale_inc || 'Zoom In UI';
    if (el.fontDecBtn) el.fontDecBtn.title = dict.menu_font_dec || 'Decrease Text Size';
    if (el.fontIncBtn) el.fontIncBtn.title = dict.menu_font_inc || 'Increase Text Size';

    if (window.chrome && window.chrome.webview) {
      try {
        window.chrome.webview.postMessage('lang:' + lang);
      } catch (e) {}
    }

    // Refresh dynamic stats & labels
    if (state.rawMarkdown) {
      calculateStats(state.rawMarkdown);
    }
    if (el.searchCount && (!state.searchMatches || state.searchMatches.length === 0)) {
      if (!el.searchInput || !el.searchInput.value.trim()) {
        el.searchCount.textContent = '0 ' + (dict.search_matches || 'eşleşme');
      }
    }

    updateConvertButtonLabel();
    updateExternalModeUI();
    updateRateButtonState();
  }

  function updateRateButtonState() {
    if (!el.rateBtn) return;
    const hasRated = localStorage.getItem('neotext_has_rated') === 'true';
    const rateTextEl = el.rateBtn.querySelector('span');
    if (!rateTextEl) return;
    const currentLang = state.lang || 'en';
    const dict = I18N[currentLang] || I18N['en'] || {};
    if (hasRated) {
      el.rateBtn.classList.add('has-rated');
      rateTextEl.textContent = dict.app_rated_thanks || "Thanks for rating!";
      el.rateBtn.title = dict.app_rated_thanks || "Thanks for rating!";
    } else {
      el.rateBtn.classList.remove('has-rated');
      rateTextEl.textContent = dict.app_rate || "Rate";
      el.rateBtn.title = dict.rate_link_title || "Rate on Microsoft Store";
    }
  }

  // Check if a document is plain text (.txt, .text, .log, etc.)
  function isPlainTextDoc(fileName) {
    if (!fileName) return false;
    const lower = fileName.toLowerCase();
    return lower.endsWith('.txt') || lower.endsWith('.text') || lower.endsWith('.log') || lower.endsWith('.ini') || lower.endsWith('.cfg');
  }

  function updateConvertButtonLabel() {
    if (!el.convertDocLabel) return;
    const isTxt = isPlainTextDoc(state.fileName);
    const dict = I18N[state.lang || 'en'] || I18N.en;
    el.convertDocLabel.textContent = isTxt ? (dict.menu_convert_md || "📄 Convert to MD...") : (dict.menu_convert_txt || "📄 Convert to TXT...");
  }

  // Marked Configuration
  function setupMarked() {
    if (typeof marked === 'undefined') return;

    try {
      marked.use({
        gfm: true,
        breaks: true,
        renderer: {
          image(token) {
            let href = (typeof token === 'object' && token !== null && token.href) ? token.href : (arguments[0] || '');
            let title = (typeof token === 'object' && token !== null && token.title) ? token.title : (arguments[1] || '');
            let text = (typeof token === 'object' && token !== null && token.text) ? token.text : (arguments[2] || '');

            // Relative file path resolution for opened markdown files
            if (href && !href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('data:') && !href.startsWith('file:///')) {
              if (state.filePath && (state.filePath.includes('\\') || state.filePath.includes('/'))) {
                const normPath = state.filePath.replace(/\\/g, '/');
                const lastSlash = normPath.lastIndexOf('/');
                if (lastSlash !== -1) {
                  const docDir = normPath.substring(0, lastSlash);
                  const cleanHref = href.replace(/^\.\//, '');
                  // Check if href is already an existing asset or relative to doc
                  if (!cleanHref.startsWith('assets/')) {
                    href = 'file:///' + docDir + '/' + cleanHref;
                  }
                }
              }
            }

            const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
            return `<img src="${href}" alt="${escapeHtml(text)}"${titleAttr} loading="lazy" style="max-width: 100%; height: auto; border-radius: 8px; margin: 12px 0;" />`;
          },
          code(token) {
            const text = typeof token === 'object' && token !== null ? token.text : String(token || '');
            const lang = typeof token === 'object' && token !== null ? (token.lang || 'text') : (arguments[1] || 'text');
            const validLang = (lang || 'text').toLowerCase().split(/\s+/)[0];
            const codeEscaped = escapeHtml(text || '');

            let highlighted = codeEscaped;
            if (typeof Prism !== 'undefined' && Prism.languages && Prism.languages[validLang]) {
              try {
                highlighted = Prism.highlight(text, Prism.languages[validLang], validLang);
              } catch (e) {
                highlighted = codeEscaped;
              }
            }

            return `
              <div class="code-block-wrapper">
                <div class="code-header">
                  <span title="${(state.lang === 'tr' ? 'Dili değiştirmek için çift tıklayın' : 'Double-click to edit language')}">${validLang}</span>
                  <button class="copy-btn" onclick="(window.__neotext_copyCode || window.__neomd_copyCode)(this)">
                    <svg class="copy-btn-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    <span class="copy-btn-text" data-i18n="copy_code_btn">${(I18N[state.lang || 'en'] || I18N.en).copy_code_btn || 'Copy'}</span>
                  </button>
                </div>
                <pre><code class="language-${validLang}">${highlighted}</code></pre>
              </div>
            `;
          },
          blockquote(token) {
            let quoteHtml = '';
            if (typeof token === 'object' && token !== null && token.tokens && this.parser) {
              quoteHtml = this.parser.parse(token.tokens);
            } else if (typeof token === 'object' && token !== null && token.text) {
              quoteHtml = `<p>${token.text}</p>`;
            } else {
              quoteHtml = String(token || '');
            }

            const calloutRegex = /<p>\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|NOT|İPUCU|IPUCU|ÖNEMLİ|ONEMLI|UYARI|DİKKAT|DIKKAT)\](?:\s*<br>)?\s*([\s\S]*?)<\/p>/i;
            const match = quoteHtml.match(calloutRegex);

            if (match) {
              const rawTag = match[1].toUpperCase();
              const content = match[2];
              const calloutMap = {
                'NOTE': { class: 'note', title: 'Note', icon: 'ℹ️' },
                'TIP': { class: 'tip', title: 'Tip', icon: '💡' },
                'IMPORTANT': { class: 'important', title: 'Important', icon: '📌' },
                'WARNING': { class: 'warning', title: 'Warning', icon: '⚠️' },
                'CAUTION': { class: 'caution', title: 'Caution', icon: '🚨' },
                'NOT': { class: 'note', title: 'Not', icon: 'ℹ️' },
                'İPUCU': { class: 'tip', title: 'İpucu', icon: '💡' },
                'IPUCU': { class: 'tip', title: 'İpucu', icon: '💡' },
                'ÖNEMLİ': { class: 'important', title: 'Önemli', icon: '📌' },
                'ONEMLI': { class: 'important', title: 'Önemli', icon: '📌' },
                'UYARI': { class: 'warning', title: 'Uyarı', icon: '⚠️' },
                'DİKKAT': { class: 'caution', title: 'Dikkat', icon: '🚨' },
                'DIKKAT': { class: 'caution', title: 'Dikkat', icon: '🚨' }
              };
              const def = calloutMap[rawTag] || { class: 'note', title: rawTag, icon: 'ℹ️' };
              const rest = quoteHtml.replace(match[0], `<p>${content}</p>`);

              return `
                <div class="callout callout-${def.class}">
                  <div class="callout-title">
                    <span>${def.icon}</span>
                    <span>${def.title}</span>
                  </div>
                  ${rest}
                </div>
              `;
            }

            return `<blockquote>${quoteHtml}</blockquote>`;
          },
          list(token) {
            const isObj = typeof token === 'object' && token !== null;
            const ordered = isObj ? token.ordered : arguments[1];
            const start = isObj ? token.start : arguments[2];
            let body = '';
            if (isObj && token.items) {
              for (let o = 0; o < token.items.length; o++) {
                body += this.listitem(token.items[o]);
              }
            } else {
              body = arguments[0] || '';
            }

            if (ordered) {
              const startAttr = (start && start !== 1) ? ` start="${start}"` : '';
              return `<ol${startAttr}>\n${body}</ol>\n`;
            }
            const raw = isObj && token.raw ? token.raw.trim() : '';
            const isDot = raw.startsWith('*');
            const bulletAttr = isDot ? ' class="list-dot" data-bullet="dot"' : ' class="list-dash" data-bullet="dash"';
            return `<ul${bulletAttr}>\n${body}</ul>\n`;
          }
        }
      });
    } catch (e) {
      console.warn('Marked.use error:', e);
    }
  }

  // Load Document (Multi-window & Session Support)
  function loadDocument() {
    // 1. In-memory data injected by C# host takes absolute priority (100% offline, zero disk lag)
    if ((window.__NEOTEXT_DATA__ || window.__NEOMD_DATA__) && (typeof (window.__NEOTEXT_DATA__ || window.__NEOMD_DATA__).content === 'string' || typeof (window.__NEOTEXT_DATA__ || window.__NEOMD_DATA__).rawMarkdown === 'string')) {
      renderData((window.__NEOTEXT_DATA__ || window.__NEOMD_DATA__));
      return;
    }

    const hash = (window.location.hash || '').replace(/^#/, '');
    const hashParams = new URLSearchParams(hash);
    const urlParams = new URLSearchParams(window.location.search);
    const sessionParam = hashParams.get('s') || urlParams.get('s');

    // 2. If specific session ID is in URL, fetch its dedicated session data
    if (sessionParam) {
      const scriptUrl = 'sessions/' + sessionParam + '.js?t=' + Date.now();
      const s = document.createElement('script');
      s.src = scriptUrl;
      s.onload = function() {
        if ((window.__NEOTEXT_DATA__ || window.__NEOMD_DATA__) && (typeof (window.__NEOTEXT_DATA__ || window.__NEOMD_DATA__).content === 'string' || typeof (window.__NEOTEXT_DATA__ || window.__NEOMD_DATA__).rawMarkdown === 'string')) {
          renderData((window.__NEOTEXT_DATA__ || window.__NEOMD_DATA__));
        } else {
          loadFallback();
        }
      };
      s.onerror = function() {
        loadFallback();
      };
      document.head.appendChild(s);
      return;
    }

    loadFallback();
  }

  function loadFallback() {
    fetchActiveDataScript();
  }

  function fetchActiveDataScript() {
    const s = document.createElement('script');
    s.src = 'active_data.js?t=' + Date.now();
    s.onload = function() {
      if ((window.__NEOTEXT_DATA__ || window.__NEOMD_DATA__) && (typeof (window.__NEOTEXT_DATA__ || window.__NEOMD_DATA__).content === 'string' || typeof (window.__NEOTEXT_DATA__ || window.__NEOMD_DATA__).rawMarkdown === 'string')) {
        renderData((window.__NEOTEXT_DATA__ || window.__NEOMD_DATA__));
      } else {
        renderWelcomeFallback();
      }
    };
    s.onerror = function() {
      renderWelcomeFallback();
    };
    document.head.appendChild(s);
  }

  function renderWelcomeFallback() {
    const isTr = (state.lang === 'tr');
    renderData({
      fileName: isTr ? 'NeoText Hoşgeldiniz.md' : 'Welcome to NeoText.md',
      filePath: 'Introduction.md',
      content: getWelcomeMarkdown(),
      lastModified: Date.now()
    });
  }

    // Lightweight zero-dependency DOM-based HTML Sanitizer (XSS & Injection Protection)
  function sanitizeRenderedHtml(rawHtml) {
    if (!rawHtml || typeof rawHtml !== 'string') return '';
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawHtml, 'text/html');

      // 1. Remove dangerous executable elements completely
      const dangerousTags = ['script', 'iframe', 'object', 'embed', 'form', 'applet', 'meta', 'link', 'base'];
      for (let i = 0; i < dangerousTags.length; i++) {
        const elements = doc.querySelectorAll(dangerousTags[i]);
        for (let j = 0; j < elements.length; j++) {
          elements[j].remove();
        }
      }

      // 2. Sanitize all remaining elements: strip inline event handlers (on*) and dangerous URIs
      const allElements = doc.querySelectorAll('*');
      for (let i = 0; i < allElements.length; i++) {
        const item = allElements[i];
        const attrs = Array.from(item.attributes);
        for (let j = 0; j < attrs.length; j++) {
          const attr = attrs[j];
          const name = attr.name.toLowerCase();
          const val = (attr.value || '').trim().toLowerCase();

          // Strip any attribute starting with 'on' (onclick, onerror, onload, onmouseover, etc.)
          if (name.startsWith('on')) {
            item.removeAttribute(attr.name);
            continue;
          }

          // Strip dangerous protocols in links, images, or actions
          if (name === 'href' || name === 'src' || name === 'action' || name === 'data') {
            if (val.startsWith('javascript:') || val.startsWith('vbscript:') || (val.startsWith('data:') && !val.startsWith('data:image/'))) {
              item.removeAttribute(attr.name);
            }
          }
        }
      }

      return doc.body.innerHTML;
    } catch (e) {
      console.warn('Sanitizer warning, falling back to escaped HTML:', e);
      return escapeHtml(rawHtml);
    }
  }

  // Render Markdown / Plain Text to DOM
  function renderData(data) {
    state.rawMarkdown = (typeof data.content === 'string') ? data.content : ((typeof data.rawMarkdown === 'string') ? data.rawMarkdown : '');
    state.filePath = data.filePath || '';
    state.fileName = data.fileName || 'Belge.md';
    state.originalRaw = state.rawMarkdown;
    state.lastModified = data.lastModified || Date.now();
    if (data.sessionId) {
      state.sessionId = data.sessionId;
      const currentHash = (window.location.hash || '').replace(/^#/, '');
      if (!currentHash || !currentHash.includes('s=')) {
        try {
          history.replaceState(null, '', '#s=' + data.sessionId);
        } catch (e) { }
      }
    }

    // Sync with Multi-Tab System
    const existing = state.tabs.find(t => t.filePath && t.filePath === state.filePath);
    if (existing) {
      existing.rawMarkdown = state.rawMarkdown;
      existing.originalRaw = state.rawMarkdown;
      existing.fileName = state.fileName;
      state.activeTabId = existing.id;
    } else if (state.tabs.length === 0) {
      const initialTab = {
        id: 'tab_' + Date.now(),
        filePath: state.filePath,
        fileName: state.fileName,
        rawMarkdown: state.rawMarkdown,
        originalRaw: data.isDirty ? '' : state.rawMarkdown,
        isDirty: !!data.isDirty,
        isEditing: false,
        isRawMode: false,
        scrollTop: 0
      };
      state.tabs.push(initialTab);
      state.activeTabId = initialTab.id;
      if (data.isDirty) {
        state.isDirty = true;
      }
    } else {
      const emptyTab = state.tabs.find(t => !t.filePath && !t.isDirty && (!t.rawMarkdown || !t.rawMarkdown.trim()));
      if (emptyTab) {
        emptyTab.filePath = state.filePath;
        emptyTab.fileName = state.fileName;
        emptyTab.rawMarkdown = state.rawMarkdown;
        emptyTab.originalRaw = state.rawMarkdown;
        state.activeTabId = emptyTab.id;
      } else {
        const newTab = {
          id: 'tab_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          filePath: state.filePath,
          fileName: state.fileName,
          rawMarkdown: state.rawMarkdown,
          originalRaw: state.rawMarkdown,
          isDirty: false,
          isEditing: false,
          isRawMode: false,
          scrollTop: 0
        };
        state.tabs.push(newTab);
        state.activeTabId = newTab.id;
      }
    }

    updateWindowTitle();
    if (el.documentTitle) {
      el.documentTitle.textContent = state.fileName;
    }
    updateConvertButtonLabel();

    renderMarkdown();
    renderTabsBar();
  }

  // Render Markdown / Plain Text to DOM
  function renderMarkdown() {
    const isTxt = isPlainTextDoc(state.fileName);
    if (isTxt) {
      el.markdownBody.classList.add('is-txt-document');
      el.markdownBody.textContent = state.rawMarkdown;
    } else {
      el.markdownBody.classList.remove('is-txt-document');

      // High-performance guard for massive files (>2 MB)
      if (state.rawMarkdown && state.rawMarkdown.length > 2 * 1024 * 1024) {
        el.markdownBody.innerHTML = '<div class="large-file-notice" style="padding:10px 14px; margin-bottom:16px; border-radius:8px; background:rgba(234,179,8,0.12); border:1px solid rgba(234,179,8,0.3); font-size:13px; color:#eab308;">⚠️ <strong>Büyük Dosya Koruması:</strong> Belge 2 MB üzerinde olduğu için sistem performansını korumak amacıyla doğrudan metin modunda görüntülendi.</div>' +
                                    '<pre style="white-space:pre-wrap; word-break:break-word; font-family:Consolas, monospace; font-size:14px; line-height:1.6;">' + escapeHtml(state.rawMarkdown) + '</pre>';
        buildTableOfContents();
        calculateStats(state.rawMarkdown);
        return;
      }

      // Process KaTeX
      let processed = processMath(state.rawMarkdown);

      // Render with marked
      let html = '';
      try {
        if (typeof marked !== 'undefined') {
          html = marked.parse(processed);
        } else {
          html = '<pre>' + escapeHtml(processed) + '</pre>';
        }
      } catch (parseErr) {
        console.error('Marked parse error:', parseErr);
        try {
          html = marked.parse(state.rawMarkdown);
        } catch (e2) {
          html = '<pre style="white-space:pre-wrap;">' + escapeHtml(state.rawMarkdown) + '</pre>';
        }
      }

      // Pass rendered HTML through DOM Sanitizer before setting innerHTML
      el.markdownBody.innerHTML = sanitizeRenderedHtml(html);
    }

    // Build Table of Contents & Stats
    buildTableOfContents();
    calculateStats(state.rawMarkdown);

    // Cache heading positions for lag-free ScrollSpy
    requestAnimationFrame(updateHeadingPositions);
  }

  // Safe programmatic scroll
  function safeScrollTo(targetElement) {
    if (!targetElement || !el.viewport) return;
    const viewportRect = el.viewport.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();
    const currentScroll = el.viewport.scrollTop;
    const targetTop = targetRect.top - viewportRect.top + currentScroll - 24;

    el.viewport.scrollTo({
      top: Math.max(0, targetTop),
      behavior: 'smooth'
    });
  }

  // Math Rendering (KaTeX)
  function processMath(text) {
    if (typeof katex === 'undefined') return text;

    try {
      // Block math $$...$$
      text = text.replace(/\$\$([\s\S]+?)\$\$/g, function(match, math) {
        try {
          return `<div class="math-block" data-raw-math="${encodeURIComponent(math.trim())}" style="overflow-x:auto;padding:8px 0;text-align:center;">${katex.renderToString(math.trim(), { displayMode: true, throwOnError: false })}</div>`;
        } catch (e) {
          return match;
        }
      });

      // Inline math $...$
      text = text.replace(/(^|[^\\])\$([^\$\n\r]+?)\$/g, function(match, prefix, math) {
        try {
          return prefix + `<span class="math-inline" data-raw-math="${encodeURIComponent(math.trim())}">${katex.renderToString(math.trim(), { displayMode: false, throwOnError: false })}</span>`;
        } catch (e) {
          return match;
        }
      });
    } catch (e) {
      console.warn('Math processing error:', e);
    }

    return text;
  }

  // Table of Contents Builder
  function buildTableOfContents() {
    if (!el.tocList) return;
    el.tocList.innerHTML = '';

    const headings = el.markdownBody.querySelectorAll('h1, h2, h3, h4');
    if (headings.length === 0) {
      const dict = I18N[state.lang || 'en'] || I18N.en;
      el.tocList.innerHTML = `<li style="color:var(--text-muted);padding:8px;">${escapeHtml(dict.toc_empty || 'No headings found.')}</li>`;
      return;
    }

    headings.forEach((heading, idx) => {
      const level = heading.tagName.toLowerCase();
      let id = heading.id;
      if (!id) {
        id = 'heading-' + idx + '-' + slugify(heading.textContent);
        heading.id = id;
      }

      const li = document.createElement('li');
      li.className = `toc-item toc-${level}`;

      const a = document.createElement('a');
      a.className = 'toc-link';
      a.href = '#' + id;
      a.textContent = heading.textContent;
      a.dataset.targetId = id;

      a.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(id);
        if (target) {
          safeScrollTo(target);
        }
      });

      li.appendChild(a);
      el.tocList.appendChild(li);
    });
  }

  // Cached Heading Positions for Zero-Lag ScrollSpy
  function updateHeadingPositions() {
    const headings = el.markdownBody.querySelectorAll('h1, h2, h3, h4');
    state.headingPositions = [];
    headings.forEach(h => {
      state.headingPositions.push({
        id: h.id,
        top: h.offsetTop
      });
    });
  }

  window.addEventListener('resize', () => {
    updateHeadingPositions();
  });

  // Lag-Free Scroll Handler
  let isScrollingTicking = false;
  el.viewport.addEventListener('scroll', () => {
    if (!isScrollingTicking) {
      window.requestAnimationFrame(() => {
        handleScrollSpy();
        isScrollingTicking = false;
      });
      isScrollingTicking = true;
    }
  }, { passive: true });

  function handleScrollSpy() {
    if (state.headingPositions.length === 0) return;
    const scrollPos = el.viewport.scrollTop + 80;
    let currentId = state.headingPositions[0].id;

    for (let i = 0; i < state.headingPositions.length; i++) {
      if (state.headingPositions[i].top <= scrollPos) {
        currentId = state.headingPositions[i].id;
      } else {
        break;
      }
    }

    const links = el.tocList.querySelectorAll('.toc-link');
    links.forEach(link => {
      if (link.dataset.targetId === currentId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Calculate Document Stats (Integrated into Outline Pane)
  function calculateStats(text) {
    if (!el.statWords) return;
    if (state.tabs.length === 0 || text === null || text === undefined) {
      if (el.outlineStatsCard) el.outlineStatsCard.classList.add('empty-hidden');
      return;
    }
    if (el.outlineStatsCard) el.outlineStatsCard.classList.remove('empty-hidden');

    const dict = I18N[state.lang || 'en'] || I18N.en;
    const str = String(text || '');
    const words = (str.match(/[\w\u00C0-\u017F]+/g) || []).length;
    const chars = str.length;
    const readingMinutes = Math.max(1, Math.ceil(words / 200));

    el.statWords.textContent = words.toLocaleString(state.lang || 'en');
    el.statChars.textContent = chars.toLocaleString(state.lang || 'en');
    el.statTime.textContent = readingMinutes + ' ' + (dict.stat_time_unit || 'dk');
    if (el.statPath) {
      el.statPath.textContent = state.filePath || state.fileName || '-';
      el.statPath.title = state.filePath || state.fileName || '-';
    }
  }

  // In-Document Search & True Contextual Snippet Generator
  function performSearch(query) {
    clearHighlights();
    state.searchMatches = [];
    state.currentSearchIdx = -1;
    if (el.searchResultsList) el.searchResultsList.innerHTML = '';

    const cleanQuery = (query || '').trim();
    const dict = I18N[state.lang || 'en'] || I18N.en;
    if (!cleanQuery) {
      if (el.searchCount) el.searchCount.textContent = '0 ' + (dict.search_matches || 'matches');
      return;
    }

    const regex = new RegExp(`(${escapeRegExp(cleanQuery)})`, 'gi');
    highlightText(el.markdownBody, regex);

    state.searchMatches = Array.from(el.markdownBody.querySelectorAll('mark.search-highlight'));
    const total = state.searchMatches.length;

    if (el.searchCount) {
      el.searchCount.textContent = total > 0 ? `${total} ${dict.search_matches || 'matches'}` : (dict.search_no_match || 'No matches found');
    }

    if (total === 0) return;

    // Generate Clickable Snippets with True Surrounding Block Context
    state.searchMatches.forEach((matchEl, idx) => {
      matchEl.dataset.matchIdx = idx;

      // Extract full block text across inline tags (strong, code, em)
      const block = matchEl.closest('p, li, h1, h2, h3, h4, td, th, blockquote, pre') || matchEl.parentElement;
      const blockText = (block ? block.textContent : matchEl.parentElement.textContent || '').replace(/\s+/g, ' ').trim();
      const matchWord = matchEl.textContent;

      let snippetBefore = '';
      let snippetAfter = '';

      // Count which occurrence this matchEl is within the block to find the exact term position
      const matchesInBlock = block ? Array.from(block.querySelectorAll('mark.search-highlight')) : [matchEl];
      const occurrenceIndex = matchesInBlock.indexOf(matchEl);

      let termPos = -1;
      let searchFrom = 0;
      for (let i = 0; i <= (occurrenceIndex >= 0 ? occurrenceIndex : 0); i++) {
        termPos = blockText.toLowerCase().indexOf(matchWord.toLowerCase(), searchFrom);
        if (termPos === -1) break;
        searchFrom = termPos + matchWord.length;
      }

      if (termPos !== -1) {
        const start = Math.max(0, termPos - 36);
        const end = Math.min(blockText.length, termPos + matchWord.length + 55);
        snippetBefore = (start > 0 ? '...' : '') + blockText.substring(start, termPos).trimStart();
        snippetAfter = blockText.substring(termPos + matchWord.length, end).trimEnd() + (end < blockText.length ? '...' : '');
      } else {
        snippetBefore = '...';
        snippetAfter = '...';
      }

      const li = document.createElement('li');
      li.className = 'search-result-item';
      li.dataset.idx = idx;

      li.innerHTML = `
        <span class="search-result-index">#${idx + 1}</span> <span class="search-result-snippet">${escapeHtml(snippetBefore)}<mark>${escapeHtml(matchWord)}</mark>${escapeHtml(snippetAfter)}</span>
      `;

      li.addEventListener('click', () => {
        selectSearchMatch(idx);
      });

      el.searchResultsList.appendChild(li);
    });

    // Auto select first match
    selectSearchMatch(0);
  }

  function selectSearchMatch(idx) {
    if (idx < 0 || idx >= state.searchMatches.length) return;
    state.currentSearchIdx = idx;

    // In-page highlight
    state.searchMatches.forEach(m => m.classList.remove('current'));
    const target = state.searchMatches[idx];
    target.classList.add('current');

    // Safe scroll to target
    safeScrollTo(target);

    // Active state in sidebar list
    if (el.searchResultsList) {
      const items = el.searchResultsList.querySelectorAll('.search-result-item');
      items.forEach(it => {
        if (parseInt(it.dataset.idx, 10) === idx) {
          it.classList.add('active');
          it.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          it.classList.remove('active');
        }
      });
    }

    if (el.searchCount) {
      el.searchCount.textContent = `${idx + 1} / ${state.searchMatches.length}`;
    }
  }

  function highlightText(element, regex) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    const nodes = [];
    while (walker.nextNode()) {
      const parent = walker.currentNode.parentElement;
      if (parent.tagName !== 'SCRIPT' &&
          parent.tagName !== 'STYLE' &&
          !parent.classList.contains('copy-btn')) {
        nodes.push(walker.currentNode);
      }
    }

    nodes.forEach(node => {
      if (regex.test(node.nodeValue)) {
        const span = document.createElement('span');
        span.innerHTML = node.nodeValue.replace(regex, '<mark class="search-highlight">$1</mark>');
        node.parentElement.replaceChild(span, node);
      }
    });
  }

  function clearHighlights() {
    const marks = el.markdownBody.querySelectorAll('mark.search-highlight');
    marks.forEach(mark => {
      const parent = mark.parentNode;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });
  }

  let themeTransitionTimer = null;

  // Theme Management
  function applyTheme(theme, animate = false) {
    const effective = (theme === 'light') ? 'light' : (theme === 'oled' ? 'oled' : 'dark');
    state.theme = effective;
    setStored('theme', effective);

    // Notify C# host immediately at t=0 so DWM titlebar can sync precisely with the CSS transition midpoint
    if (window.chrome && window.chrome.webview) {
      try {
        window.chrome.webview.postMessage(effective);
      } catch (e) {}
    }

    if (animate) {
      document.documentElement.classList.add('theme-transitioning');
      clearTimeout(themeTransitionTimer);
      themeTransitionTimer = setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning');
      }, 110);
    }

    document.documentElement.setAttribute('data-theme', effective);
    document.documentElement.style.colorScheme = (effective === 'light') ? 'light' : 'dark';

    // Windows 11 Native Caption Colors:
    // OLED: Pure pitch black (#000000)
    // Dark: Anthracite matching user swatch (#1c1c1c)
    // Light: Seamless matching white header (#ffffff)
    const captionColor = (effective === 'oled') ? '#000000' : ((effective === 'dark') ? '#1c1c1c' : '#ffffff');

    let metaTheme = document.getElementById('meta-theme-color');
    if (metaTheme) {
      metaTheme.setAttribute('content', captionColor);
    } else {
      metaTheme = document.createElement('meta');
      metaTheme.id = 'meta-theme-color';
      metaTheme.name = 'theme-color';
      metaTheme.content = captionColor;
      document.head.appendChild(metaTheme);
    }

    const metaScheme = document.querySelector('meta[name="color-scheme"]');
    if (metaScheme) {
      metaScheme.setAttribute('content', effective);
    }

    updateThemeIcon(effective);
    if (el.langSelect) {
      el.langSelect.style.colorScheme = effective;
    }
    updateWindowTitle();
  }

  // Update Window Title
  function updateWindowTitle() {
    const star = state.isDirty ? ' •' : '';
    document.title = (state.fileName || 'NeoText') + star + ' - NeoText';
    if (el.documentTitle) {
      el.documentTitle.textContent = (state.fileName || 'NeoText') + star;
    }
  }

  // Dirty State Synchronization
  function setDirty(isDirty) {
    state.isDirty = isDirty;
    if (state.activeTabId) {
      const active = state.tabs.find(t => t.id === state.activeTabId);
      if (active) {
        active.isDirty = isDirty;
      }
    }
    if (window.chrome && window.chrome.webview) {
      try {
        window.chrome.webview.postMessage(isDirty ? 'dirty:true' : 'dirty:false');
      } catch (e) {}
    }
    updateWindowTitle();
    updateFloatingSaveButton();
    renderTabsBar();
  }

  // Toast Notification
  let toastTimeout = null;
  function showToast(msg) {
    if (!el.saveToast) return;
    if (el.saveToastMsg) el.saveToastMsg.textContent = msg;
    el.saveToast.classList.add('visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      el.saveToast.classList.remove('visible');
    }, 2400);
  }

  let lastVisualScrollTop = 0;
  let lastVisualScrollRatio = 0;

  // Focus helper ensuring instant visible blinking caret in all themes and document modes
  function focusEditable(elem, atEnd = false) {
    if (!elem) return;
    elem.focus({ preventScroll: true });

    try {
      const sel = window.getSelection();
      if (!sel) return;

      const range = document.createRange();

      if (elem.childNodes.length === 0 || !elem.textContent.trim()) {
        if (elem.childNodes.length === 0) {
          const textNode = document.createTextNode('');
          elem.appendChild(textNode);
          range.setStart(textNode, 0);
        } else {
          range.selectNodeContents(elem);
        }
        range.collapse(true);
      } else if (atEnd) {
        range.selectNodeContents(elem);
        range.collapse(false);
      } else {
        range.selectNodeContents(elem);
        range.collapse(true);
      }

      sel.removeAllRanges();
      sel.addRange(range);
    } catch (e) {
      console.warn('focusEditable error:', e);
    }
  }

  // In-place Easy Edit Mode Toggle
  function toggleEditMode(forceState) {
    const next = (typeof forceState === 'boolean') ? forceState : !state.isEditing;
    if (next === state.isEditing) return;

    const savedScrollTop = el.viewport ? el.viewport.scrollTop : 0;
    state.isEditing = next;
    const isTxt = isPlainTextDoc(state.fileName);

    if (state.isEditing) {
      state.originalRaw = state.rawMarkdown;
      if (el.editBtn) el.editBtn.classList.add('active');
      if (el.floatingSaveBtn) el.floatingSaveBtn.classList.add('visible');

      if (isTxt) {
        if (el.editToolbar) el.editToolbar.classList.remove('visible');
        el.markdownBody.contentEditable = "plaintext-only";
      } else {
        if (el.editToolbar) el.editToolbar.classList.add('visible');
        el.markdownBody.contentEditable = "true";
        el.markdownBody.querySelectorAll('.code-header, .callout-title, .math-block, .math-inline').forEach(elem => {
          elem.setAttribute('contenteditable', 'false');
        });
      }

      document.body.classList.add('is-editing');
      focusEditable(el.markdownBody, false);
      if (el.viewport) {
        el.viewport.scrollTop = savedScrollTop;
        requestAnimationFrame(() => {
          el.viewport.scrollTop = savedScrollTop;
        });
      }
    } else {
      document.body.classList.remove('is-editing');
      if (state.isRawMode) {
        toggleRawMode(false);
      }

      el.markdownBody.removeAttribute('contenteditable');
      el.markdownBody.querySelectorAll('[contenteditable="false"]').forEach(elem => {
        elem.removeAttribute('contenteditable');
      });

      if (el.editBtn) el.editBtn.classList.remove('active');
      if (el.floatingSaveBtn) el.floatingSaveBtn.classList.remove('visible');
      if (el.editToolbar) el.editToolbar.classList.remove('visible');
      closeBulletPopover();

      if (el.viewport) {
        el.viewport.scrollTop = savedScrollTop;
        requestAnimationFrame(() => {
          el.viewport.scrollTop = savedScrollTop;
        });
      }
    }
    updateToolbarActiveStates();
  }

  // Raw Markdown Source Code Editor Toggle
  function toggleRawMode(forceState) {
    const next = (typeof forceState === 'boolean') ? forceState : !state.isRawMode;
    if (next === state.isRawMode) return;

    closeBulletPopover();

    const vp = el.viewport;
    state.isRawMode = next;

    if (state.isRawMode) {
      // Capture visual scroll before hiding
      lastVisualScrollTop = vp ? vp.scrollTop : 0;
      const maxScroll = vp ? (vp.scrollHeight - vp.clientHeight) : 0;
      lastVisualScrollRatio = (vp && maxScroll > 0) ? (vp.scrollTop / maxScroll) : 0;

      // Sync visual DOM to raw editor textarea
      const isTxt = isPlainTextDoc(state.fileName);
      if (isTxt) {
        state.rawMarkdown = el.markdownBody.innerText;
      } else {
        state.rawMarkdown = htmlToMarkdown(el.markdownBody);
      }
      if (el.rawEditor) {
        el.rawEditor.value = state.rawMarkdown;
        autoResizeRawEditor();
      }

      if (el.markdownBody) el.markdownBody.classList.add('raw-hidden');
      if (el.rawEditor) {
        el.rawEditor.classList.add('visible');

        // Restore proportional cursor position
        const totalLen = el.rawEditor.value.length;
        const targetPos = Math.floor(totalLen * lastVisualScrollRatio);
        const lineStart = el.rawEditor.value.lastIndexOf('\n', targetPos);
        const caretPos = lineStart !== -1 ? lineStart + 1 : targetPos;
        el.rawEditor.setSelectionRange(caretPos, caretPos);
        el.rawEditor.focus({ preventScroll: true });
      }
      if (el.toolRawBtn) el.toolRawBtn.classList.add('active');

      if (vp) {
        autoResizeRawEditor();
        const newMax = vp.scrollHeight - vp.clientHeight;
        const targetScroll = Math.round(newMax * lastVisualScrollRatio);
        vp.scrollTop = targetScroll;
        requestAnimationFrame(() => {
          autoResizeRawEditor();
          const nm = vp.scrollHeight - vp.clientHeight;
          vp.scrollTop = Math.round(nm * lastVisualScrollRatio);
        });
      }
    } else {
      // Exiting RAW mode
      const rawMax = vp ? (vp.scrollHeight - vp.clientHeight) : 0;
      const rawRatio = (vp && rawMax > 0) ? (vp.scrollTop / rawMax) : 0;

      // Sync raw editor textarea back to visual DOM
      if (el.rawEditor) state.rawMarkdown = el.rawEditor.value;
      renderMarkdown();

      if (el.markdownBody) el.markdownBody.classList.remove('raw-hidden');
      if (el.rawEditor) el.rawEditor.classList.remove('visible');
      if (el.toolRawBtn) el.toolRawBtn.classList.remove('active');

      if (state.isEditing && el.markdownBody) {
        const isTxt = isPlainTextDoc(state.fileName);
        if (isTxt) {
          el.markdownBody.contentEditable = "plaintext-only";
        } else {
          el.markdownBody.contentEditable = "true";
          el.markdownBody.querySelectorAll('.code-header, .callout-title, .math-block, .math-inline').forEach(elem => {
            elem.setAttribute('contenteditable', 'false');
          });
        }
        el.markdownBody.focus({ preventScroll: true });
      }

      if (vp) {
        const targetScroll = Math.abs(rawRatio - lastVisualScrollRatio) < 0.08
          ? lastVisualScrollTop
          : Math.round((vp.scrollHeight - vp.clientHeight) * rawRatio);

        vp.scrollTop = targetScroll;
        requestAnimationFrame(() => {
          vp.scrollTop = targetScroll;
        });
      }
    }
    updateToolbarActiveStates();
  }

  function autoResizeRawEditor() {
    if (!el.rawEditor) return;
    el.rawEditor.style.height = 'auto';
    const minH = el.viewport ? (el.viewport.clientHeight - 80) : 400;
    el.rawEditor.style.height = Math.max(minH, el.rawEditor.scrollHeight + 80) + 'px';
  }

  // Bullet Popover Helpers
  function toggleBulletPopover() {
    if (!el.toolUlPopover) return;
    el.toolUlPopover.classList.toggle('visible');
  }

  function closeBulletPopover() {
    if (el.toolUlPopover) {
      el.toolUlPopover.classList.remove('visible');
    }
  }

  // Insert Markdown syntax pattern at cursor/selection in Raw Editor
  function insertRawPattern(tool) {
    const ta = el.rawEditor;
    if (!ta) return;

    ta.focus();
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const val = ta.value;
    const selText = val.substring(start, end);

    let replacement = '';
    let newCursorPos = start;
    let newSelectLen = 0;

    switch (tool) {
      case 'h1':
        if (selText) {
          replacement = '# ' + selText;
          newCursorPos = start;
          newSelectLen = replacement.length;
        } else {
          const lastNl = val.lastIndexOf('\n', start - 1);
          const lineStart = lastNl === -1 ? 0 : lastNl + 1;
          ta.selectionStart = lineStart;
          ta.selectionEnd = lineStart;
          document.execCommand('insertText', false, '# ');
          setDirty(true);
          return;
        }
        break;
      case 'h2':
        if (selText) {
          replacement = '## ' + selText;
          newCursorPos = start;
          newSelectLen = replacement.length;
        } else {
          const lastNl = val.lastIndexOf('\n', start - 1);
          const lineStart = lastNl === -1 ? 0 : lastNl + 1;
          ta.selectionStart = lineStart;
          ta.selectionEnd = lineStart;
          document.execCommand('insertText', false, '## ');
          setDirty(true);
          return;
        }
        break;
      case 'bold':
        if (selText) {
          replacement = '**' + selText + '**';
          newCursorPos = start;
          newSelectLen = replacement.length;
        } else {
          replacement = '**bold**';
          newCursorPos = start + 2;
          newSelectLen = 4;
        }
        break;
      case 'italic':
        if (selText) {
          replacement = '*' + selText + '*';
          newCursorPos = start;
          newSelectLen = replacement.length;
        } else {
          replacement = '*italic*';
          newCursorPos = start + 1;
          newSelectLen = 6;
        }
        break;
      case 'ul':
      case 'ul-dash':
        if (selText) {
          const lines = selText.split('\n');
          replacement = lines.map(l => l.startsWith('- ') ? l.substring(2) : '- ' + l.replace(/^\*\s+/, '')).join('\n');
          newCursorPos = start;
          newSelectLen = replacement.length;
        } else {
          const lastNl = val.lastIndexOf('\n', start - 1);
          const lineStart = lastNl === -1 ? 0 : lastNl + 1;
          ta.selectionStart = lineStart;
          ta.selectionEnd = lineStart;
          document.execCommand('insertText', false, '- ');
          setDirty(true);
          return;
        }
        break;
      case 'ul-dot':
        if (selText) {
          const lines = selText.split('\n');
          replacement = lines.map(l => l.startsWith('* ') ? l.substring(2) : '* ' + l.replace(/^-\s+/, '')).join('\n');
          newCursorPos = start;
          newSelectLen = replacement.length;
        } else {
          const lastNl = val.lastIndexOf('\n', start - 1);
          const lineStart = lastNl === -1 ? 0 : lastNl + 1;
          ta.selectionStart = lineStart;
          ta.selectionEnd = lineStart;
          document.execCommand('insertText', false, '* ');
          setDirty(true);
          return;
        }
        break;
      case 'ol':
        if (selText) {
          const lines = selText.split('\n');
          replacement = lines.map((l, idx) => (idx + 1) + '. ' + l.replace(/^\d+\.\s*/, '')).join('\n');
          newCursorPos = start;
          newSelectLen = replacement.length;
        } else {
          const lastNl = val.lastIndexOf('\n', start - 1);
          const lineStart = lastNl === -1 ? 0 : lastNl + 1;
          ta.selectionStart = lineStart;
          ta.selectionEnd = lineStart;
          document.execCommand('insertText', false, '1. ');
          setDirty(true);
          return;
        }
        break;
      case 'quote':
        if (selText) {
          const lines = selText.split('\n');
          replacement = lines.map(l => l.startsWith('> ') ? l : '> ' + l).join('\n');
          newCursorPos = start;
          newSelectLen = replacement.length;
        } else {
          const lastNl = val.lastIndexOf('\n', start - 1);
          const lineStart = lastNl === -1 ? 0 : lastNl + 1;
          ta.selectionStart = lineStart;
          ta.selectionEnd = lineStart;
          document.execCommand('insertText', false, '> ');
          setDirty(true);
          return;
        }
        break;
      case 'code':
        if (selText.includes('\n')) {
          replacement = '```\n' + selText + '\n```\n';
          newCursorPos = start + 4;
          newSelectLen = selText.length;
        } else if (selText) {
          replacement = '`' + selText + '`';
          newCursorPos = start;
          newSelectLen = replacement.length;
        } else {
          replacement = '```\ncode\n```\n';
          newCursorPos = start + 4;
          newSelectLen = 4;
        }
        break;
      default:
        return;
    }

    ta.setRangeText(replacement, start, end, 'select');
    if (newSelectLen > 0) {
      ta.selectionStart = newCursorPos;
      ta.selectionEnd = newCursorPos + newSelectLen;
    }
    setDirty(true);
  }

  // Format Visual Heading (Toggle between Level and Paragraph with List protection)
  function formatVisualHeading(level) {
    if (!el.markdownBody) return;
    el.markdownBody.focus({ preventScroll: true });

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      document.execCommand('formatBlock', false, '<' + level + '>');
      setDirty(true);
      updateToolbarActiveStates();
      return;
    }

    let node = sel.anchorNode;
    if (!node) return;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;

    // Find enclosing block element within markdownBody
    let block = null;
    let curr = node;
    while (curr && curr !== el.markdownBody) {
      const tag = curr.tagName.toLowerCase();
      if (/^h[1-6]$/.test(tag) || tag === 'p' || tag === 'li' || tag === 'blockquote') {
        block = curr;
        break;
      }
      curr = curr.parentNode;
    }

    if (!block) {
      document.execCommand('formatBlock', false, '<' + level + '>');
      setDirty(true);
      updateToolbarActiveStates();
      return;
    }

    const currentTag = block.tagName.toLowerCase();

    // If inside a list item (li): prevent nested heading pollution
    if (currentTag === 'li') {
      const nestedH = block.querySelector('h1, h2, h3, font');
      if (nestedH) {
        block.innerHTML = block.textContent;
        setDirty(true);
        updateToolbarActiveStates();
        return;
      }
      // Breakout from list item into a standalone heading
      document.execCommand('insertUnorderedList', false, null);
      document.execCommand('formatBlock', false, '<' + level + '>');
      setDirty(true);
      updateToolbarActiveStates();
      return;
    }

    // Toggle behavior: if already this heading, convert back to paragraph
    if (currentTag === level) {
      document.execCommand('formatBlock', false, '<p>');
      cleanHeadingArtifacts(block);
    } else {
      document.execCommand('formatBlock', false, '<' + level + '>');
    }
    setDirty(true);
    updateToolbarActiveStates();
  }

  function cleanHeadingArtifacts(elem) {
    if (!elem) return;
    const artifacts = elem.querySelectorAll('h1, h2, h3, font');
    artifacts.forEach(bad => {
      const parent = bad.parentNode;
      if (parent) {
        while (bad.firstChild) {
          parent.insertBefore(bad.firstChild, bad);
        }
        parent.removeChild(bad);
      }
    });
  }

  function findEnclosingBlock(node) {
    if (!node) return null;
    let curr = (node.nodeType === Node.TEXT_NODE) ? node.parentNode : node;
    while (curr && curr !== el.markdownBody) {
      const tag = curr.tagName ? curr.tagName.toLowerCase() : '';
      if (/^(h[1-6]|p|div|ul|ol|table|blockquote|hr|pre)$/.test(tag)) {
        return curr;
      }
      curr = curr.parentNode;
    }
    return null;
  }

  function ensureTrailingParagraph(node) {
    if (!node || !node.parentNode) return;
    if (!node.nextElementSibling) {
      const p = document.createElement('p');
      p.innerHTML = '<br>';
      node.parentNode.appendChild(p);
    }
  }

  // In-place editable code block language badge
  function makeLanguageBadgeEditable(span) {
    if (!span || span.classList.contains('editing')) return;
    span.classList.add('editing');
    span.setAttribute('contenteditable', 'true');
    span.focus();

    const range = document.createRange();
    range.selectNodeContents(span);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    function finishEdit() {
      span.removeEventListener('blur', onBlur);
      span.removeEventListener('keydown', onKeyDown);
      span.removeAttribute('contenteditable');
      span.classList.remove('editing');

      let newLang = (span.textContent || '').trim().toLowerCase().replace(/[^a-z0-9_#-]/g, '');
      if (!newLang) newLang = 'text';
      span.textContent = newLang;

      const wrapper = span.closest('.code-block-wrapper');
      if (wrapper) {
        const codeElem = wrapper.querySelector('code');
        if (codeElem) {
          codeElem.className = 'language-' + newLang;
          if (typeof Prism !== 'undefined' && Prism.languages && Prism.languages[newLang]) {
            try {
              const rawText = codeElem.innerText || codeElem.textContent || '';
              codeElem.innerHTML = Prism.highlight(rawText, Prism.languages[newLang], newLang);
            } catch (err) {
              // fallback ignore
            }
          }
        }
      }
      setDirty(true);
      updateToolbarActiveStates();
    }

    function onBlur() {
      finishEdit();
    }

    function onKeyDown(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        span.blur();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        span.blur();
      }
    }

    span.addEventListener('blur', onBlur);
    span.addEventListener('keydown', onKeyDown);
  }

  function createVisualCodeBlock(codeText, lang) {
    const validLang = (lang || 'text').toLowerCase();
    const copyLabel = (I18N[state.lang || 'en'] || I18N.en).copy_code_btn || 'Kopyala';

    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';

    const header = document.createElement('div');
    header.className = 'code-header';
    header.setAttribute('contenteditable', 'false');

    const span = document.createElement('span');
    span.textContent = validLang;
    span.title = (state.lang === 'tr' ? 'Dili değiştirmek için çift tıklayın' : 'Double-click to edit language');

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.onclick = function() { (window.__neotext_copyCode || window.__neomd_copyCode)(this); };
    copyBtn.innerHTML = `
      <svg class="copy-btn-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <span class="copy-btn-text" data-i18n="copy_code_btn">${copyLabel}</span>
    `;

    header.appendChild(span);
    header.appendChild(copyBtn);

    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.className = 'language-' + validLang;
    code.textContent = codeText || '// code';

    pre.appendChild(code);
    wrapper.appendChild(header);
    wrapper.appendChild(pre);

    return { wrapper, code };
  }

  // Format Visual Code (Block & Inline Toggle / Selection support)
  function formatVisualCode() {
    if (!el.markdownBody) return;
    if (!el.markdownBody.contains(document.activeElement)) {
      el.markdownBody.focus({ preventScroll: true });
    }

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    let anchor = sel.anchorNode;
    if (anchor && anchor.nodeType === Node.TEXT_NODE) anchor = anchor.parentNode;

    // 1. Toggle OFF: If cursor/selection is inside a code block wrapper or pre
    const targetWrapper = anchor ? (anchor.closest('.code-block-wrapper') || anchor.closest('pre')) : null;
    if (targetWrapper) {
      const codeElem = targetWrapper.querySelector('code');
      const text = codeElem ? (codeElem.innerText || codeElem.textContent || '') : (targetWrapper.innerText || '');
      const lines = text.split('\n');
      const frag = document.createDocumentFragment();
      lines.forEach(line => {
        const p = document.createElement('p');
        if (line) {
          p.textContent = line;
        } else {
          p.innerHTML = '<br>';
        }
        frag.appendChild(p);
      });
      const firstP = frag.firstChild;
      targetWrapper.parentNode.replaceChild(frag, targetWrapper);
      if (firstP) {
        sel.removeAllRanges();
        const r = document.createRange();
        r.setStart(firstP, 0);
        r.collapse(true);
        sel.addRange(r);
      }
      setDirty(true);
      updateToolbarActiveStates();
      return;
    }

    // 2. Toggle OFF: If cursor/selection is inside inline <code> (not in wrapper)
    const inlineCode = anchor ? anchor.closest('code') : null;
    if (inlineCode) {
      const parent = inlineCode.parentNode;
      if (parent) {
        while (inlineCode.firstChild) {
          parent.insertBefore(inlineCode.firstChild, inlineCode);
        }
        parent.removeChild(inlineCode);
        setDirty(true);
        updateToolbarActiveStates();
      }
      return;
    }

    const range = sel.getRangeAt(0);

    // 3. Selection handling
    if (!range.collapsed) {
      const text = range.toString();

      // Find top enclosing blocks within markdownBody
      const startBlock = findEnclosingBlock(range.startContainer);
      const endBlock = findEnclosingBlock(range.endContainer);

      // If user selected a small phrase inside a single block without newlines, format as inline code
      if (startBlock === endBlock && !text.includes('\n') && text.length < 80) {
        const codeElem = document.createElement('code');
        codeElem.textContent = text;
        range.deleteContents();
        range.insertNode(codeElem);

        sel.removeAllRanges();
        const newRange = document.createRange();
        newRange.selectNodeContents(codeElem);
        sel.addRange(newRange);
        setDirty(true);
        updateToolbarActiveStates();
        return;
      }

      // Otherwise, convert the selected block(s) into a Code Block!
      const blockItem = createVisualCodeBlock(text.trim() || '// code', 'text');

      if (startBlock && endBlock && startBlock.parentNode) {
        const parent = startBlock.parentNode;
        let curr = startBlock;
        const toRemove = [];
        while (curr) {
          toRemove.push(curr);
          if (curr === endBlock) break;
          curr = curr.nextElementSibling;
        }
        parent.insertBefore(blockItem.wrapper, startBlock);
        toRemove.forEach(b => {
          if (b.parentNode) b.parentNode.removeChild(b);
        });
      } else {
        range.deleteContents();
        range.insertNode(blockItem.wrapper);
      }

      ensureTrailingParagraph(blockItem.wrapper);

      sel.removeAllRanges();
      const newRange = document.createRange();
      newRange.selectNodeContents(blockItem.code);
      sel.addRange(newRange);
      setDirty(true);
      updateToolbarActiveStates();
      return;
    }

    // 4. Collapsed cursor (no selection): Insert a new Code Block Wrapper!
    const enclosingBlock = findEnclosingBlock(anchor);
    const blockItem = createVisualCodeBlock('// code', 'text');

    if (enclosingBlock && enclosingBlock !== el.markdownBody && enclosingBlock.parentNode) {
      if (enclosingBlock.textContent.trim() === '') {
        // Replace empty block
        enclosingBlock.parentNode.replaceChild(blockItem.wrapper, enclosingBlock);
      } else {
        // Insert after current block
        if (enclosingBlock.nextSibling) {
          enclosingBlock.parentNode.insertBefore(blockItem.wrapper, enclosingBlock.nextSibling);
        } else {
          enclosingBlock.parentNode.appendChild(blockItem.wrapper);
        }
      }
    } else {
      el.markdownBody.appendChild(blockItem.wrapper);
    }

    ensureTrailingParagraph(blockItem.wrapper);

    // Focus and select the placeholder text inside code block
    sel.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(blockItem.code);
    sel.addRange(newRange);
    setDirty(true);
    updateToolbarActiveStates();
  }

  // Format Visual List (Dash vs Dot vs Numbered)
  function formatVisualList(type) {
    if (!el.markdownBody) return;
    el.markdownBody.focus({ preventScroll: true });

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    let curr = sel.anchorNode;
    if (curr && curr.nodeType === Node.TEXT_NODE) curr = curr.parentNode;

    if (type === 'numbered') {
      const existingOl = curr ? curr.closest('ol') : null;
      if (existingOl) {
        document.execCommand('insertOrderedList', false, null);
      } else {
        document.execCommand('insertOrderedList', false, null);
      }
      setDirty(true);
      updateToolbarActiveStates();
      return;
    }

    const existingOl = curr ? curr.closest('ol') : null;
    if (existingOl) {
      document.execCommand('insertUnorderedList', false, null);
      let newCurr = window.getSelection().anchorNode;
      if (newCurr && newCurr.nodeType === Node.TEXT_NODE) newCurr = newCurr.parentNode;
      const newUl = newCurr ? newCurr.closest('ul') : null;
      if (newUl) {
        newUl.setAttribute('data-bullet', type);
        newUl.classList.remove('list-dash', 'list-dot');
        newUl.classList.add('list-' + type);
      }
      setDirty(true);
      updateToolbarActiveStates();
      return;
    }

    const existingUl = curr ? curr.closest('ul') : null;
    if (existingUl) {
      const currentBullet = existingUl.getAttribute('data-bullet') || (existingUl.classList.contains('list-dash') ? 'dash' : 'dot');
      if (currentBullet === type) {
        // Toggle off list
        document.execCommand('insertUnorderedList', false, null);
      } else {
        // Switch bullet type
        existingUl.setAttribute('data-bullet', type);
        existingUl.classList.remove('list-dash', 'list-dot');
        existingUl.classList.add('list-' + type);
      }
    } else {
      document.execCommand('insertUnorderedList', false, null);
      // Retrieve newly created UL
      let newCurr = window.getSelection().anchorNode;
      if (newCurr && newCurr.nodeType === Node.TEXT_NODE) newCurr = newCurr.parentNode;
      const newUl = newCurr ? newCurr.closest('ul') : null;
      if (newUl) {
        newUl.setAttribute('data-bullet', type);
        newUl.classList.remove('list-dash', 'list-dot');
        newUl.classList.add('list-' + type);
      }
    }
    setDirty(true);
    updateToolbarActiveStates();
  }

  // Format Visual In-place DOM Dispatcher
  function formatVisual(tool) {
    if (!el.markdownBody) return;
    switch (tool) {
      case 'h1':
      case 'h2':
        formatVisualHeading(tool);
        break;
      case 'bold':
        document.execCommand('bold', false, null);
        setDirty(true);
        break;
      case 'italic':
        document.execCommand('italic', false, null);
        setDirty(true);
        break;
      case 'ul':
        toggleBulletPopover();
        break;
      case 'ol':
        document.execCommand('insertOrderedList', false, null);
        setDirty(true);
        break;
      case 'quote':
        document.execCommand('formatBlock', false, '<blockquote>');
        setDirty(true);
        break;
      case 'code':
        formatVisualCode();
        break;
      default:
        break;
    }
    updateToolbarActiveStates();
  }

  // Dynamic Active State for Formatting Toolbar Buttons (without layout shift)
  function updateToolbarActiveStates() {
    if (!state.isEditing || state.isRawMode) {
      if (el.toolBtns) {
        el.toolBtns.forEach(btn => {
          if (btn.dataset.tool !== 'raw') btn.classList.remove('active');
        });
      }
      return;
    }

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      if (el.toolBtns) {
        el.toolBtns.forEach(btn => {
          if (btn.dataset.tool !== 'raw') btn.classList.remove('active');
        });
      }
      return;
    }

    let node = sel.anchorNode;
    if (!node) return;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;

    if (!el.markdownBody || !el.markdownBody.contains(node)) {
      if (el.toolBtns) {
        el.toolBtns.forEach(btn => {
          if (btn.dataset.tool !== 'raw') btn.classList.remove('active');
        });
      }
      return;
    }

    let isH1 = false;
    let isH2 = false;
    let isBold = false;
    let isItalic = false;
    let isList = false;
    let isQuote = false;
    let isCode = false;

    let curr = node;
    while (curr && curr !== el.markdownBody) {
      const tag = curr.tagName ? curr.tagName.toLowerCase() : '';
      if (tag === 'h1') isH1 = true;
      if (tag === 'h2') isH2 = true;
      if (tag === 'strong' || tag === 'b') isBold = true;
      if (tag === 'em' || tag === 'i') isItalic = true;
      if (tag === 'ul' || tag === 'ol' || tag === 'li') isList = true;
      if (tag === 'blockquote') isQuote = true;
      if (tag === 'code' || tag === 'pre' || (curr.classList && curr.classList.contains('code-block-wrapper'))) isCode = true;
      curr = curr.parentNode;
    }

    // Only query browser command state for bold when not in a heading (h1/h2 natively report bold in browsers)
    if (!isBold && !isH1 && !isH2) {
      try {
        if (document.queryCommandState('bold')) isBold = true;
      } catch (e) {}
    }

    try {
      if (!isItalic && document.queryCommandState('italic')) isItalic = true;
      if (!isList && (document.queryCommandState('insertUnorderedList') || document.queryCommandState('insertOrderedList'))) isList = true;
    } catch (e) {}

    const map = {
      'h1': isH1,
      'h2': isH2,
      'bold': isBold,
      'italic': isItalic,
      'ul': isList,
      'quote': isQuote,
      'code': isCode
    };

    if (el.toolBtns) {
      el.toolBtns.forEach(btn => {
        const tool = btn.dataset.tool;
        if (map.hasOwnProperty(tool)) {
          btn.classList.toggle('active', !!map[tool]);
        }
      });
    }
  }

  // HTML to GitHub-Flavored Markdown (GFM) Serializer
  function htmlToMarkdown(rootEl) {
    if (!rootEl) rootEl = el.markdownBody;
    if (!rootEl) return '';

    function serializeInline(node) {
      if (!node) return '';
      if (node.nodeType === Node.TEXT_NODE) {
        return unescapeHtml(node.nodeValue);
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName.toLowerCase();
        if (tag === 'strong' || tag === 'b') {
          return '**' + serializeChildrenInline(node) + '**';
        }
        if (tag === 'em' || tag === 'i') {
          return '*' + serializeChildrenInline(node) + '*';
        }
        if (tag === 'del' || tag === 's' || tag === 'strike') {
          return '~~' + serializeChildrenInline(node) + '~~';
        }
        if (tag === 'code') {
          if (node.closest('pre') || node.closest('.code-block-wrapper')) {
            return '';
          }
          return '`' + node.textContent.replace(/`/g, '') + '`';
        }
        if (tag === 'pre' || (tag === 'div' && node.classList.contains('code-block-wrapper'))) {
          return '\n\n' + serializeBlock(node);
        }
        if (tag === 'a') {
          const href = node.getAttribute('href') || '';
          return '[' + serializeChildrenInline(node) + '](' + href + ')';
        }
        if (tag === 'span' && node.classList.contains('math-inline')) {
          const raw = node.dataset.rawMath ? decodeURIComponent(node.dataset.rawMath) : node.textContent;
          return '$' + raw.trim() + '$';
        }
        if (tag === 'br') {
          return '\n';
        }
        if (tag === 'img') {
          const alt = node.getAttribute('alt') || '';
          const src = node.getAttribute('src') || '';
          return '![' + alt + '](' + src + ')';
        }
        return serializeChildrenInline(node);
      }
      return '';
    }

    function serializeChildrenInline(parent) {
      let out = '';
      for (let i = 0; i < parent.childNodes.length; i++) {
        out += serializeInline(parent.childNodes[i]);
      }
      return out;
    }

    function serializeBlock(node) {
      if (!node) return '';
      if (node.nodeType === Node.TEXT_NODE) {
        const txt = unescapeHtml(node.nodeValue).trim();
        return txt ? txt + '\n\n' : '';
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return '';

      const tag = node.tagName.toLowerCase();

      // Headings
      if (/^h[1-6]$/.test(tag)) {
        const level = parseInt(tag[1], 10);
        const prefix = '#'.repeat(level);
        return prefix + ' ' + serializeChildrenInline(node).trim() + '\n\n';
      }

      // Paragraphs
      if (tag === 'p') {
        return serializeChildrenInline(node).trim() + '\n\n';
      }

      // Horizontal Rule
      if (tag === 'hr') {
        return '---\n\n';
      }

      // Code block wrapper
      if (tag === 'div' && node.classList.contains('code-block-wrapper')) {
        const langSpan = node.querySelector('.code-header span');
        let lang = (langSpan ? langSpan.textContent : '').trim().toLowerCase();
        if (lang === 'text') lang = '';
        const codeElem = node.querySelector('code');
        const codeText = codeElem ? (codeElem.innerText || codeElem.textContent || '') : '';
        const cleanCode = codeText.replace(/\r\n/g, '\n').replace(/^\n+|\n+$/g, '');
        return '```' + lang + '\n' + cleanCode + '\n```\n\n';
      }

      // Pre element standalone
      if (tag === 'pre') {
        const codeElem = node.querySelector('code');
        const codeText = codeElem ? (codeElem.innerText || codeElem.textContent || '') : (node.innerText || node.textContent || '');
        const cleanCode = codeText.replace(/\r\n/g, '\n').replace(/^\n+|\n+$/g, '');
        return '```\n' + cleanCode + '\n```\n\n';
      }

      // Math block
      if (tag === 'div' && node.classList.contains('math-block')) {
        const raw = node.dataset.rawMath ? decodeURIComponent(node.dataset.rawMath) : node.textContent;
        return '$$\n' + raw.trim() + '\n$$\n\n';
      }

      // Callout
      if (tag === 'div' && node.classList.contains('callout')) {
        let calloutType = 'NOTE';
        const match = node.className.match(/callout-([a-z]+)/i);
        if (match) calloutType = match[1].toUpperCase();

        const pElements = node.querySelectorAll(':scope > p');
        const lines = [];
        lines.push('> [!' + calloutType + ']');
        pElements.forEach(p => {
          const pText = serializeChildrenInline(p).trim();
          if (pText) lines.push('> ' + pText);
        });
        return lines.join('\n') + '\n\n';
      }

      // Blockquote
      if (tag === 'blockquote') {
        const pElements = node.querySelectorAll('p');
        const lines = [];
        if (pElements.length > 0) {
          pElements.forEach(p => {
            const pText = serializeChildrenInline(p).trim();
            lines.push('> ' + pText);
          });
        } else {
          const inline = serializeChildrenInline(node).trim();
          inline.split('\n').forEach(l => lines.push('> ' + l));
        }
        return lines.join('\n') + '\n\n';
      }

      // Lists (UL / OL)
      if (tag === 'ul' || tag === 'ol') {
        return serializeList(node, 0) + '\n';
      }

      // Tables
      if (tag === 'table') {
        return serializeTable(node) + '\n\n';
      }

      // Generic containers
      let out = '';
      for (let i = 0; i < node.childNodes.length; i++) {
        out += serializeBlock(node.childNodes[i]);
      }
      return out;
    }

    function serializeList(listElem, depth) {
      const isOrdered = listElem.tagName.toLowerCase() === 'ol';
      const isDash = listElem.getAttribute('data-bullet') === 'dash' || listElem.classList.contains('list-dash');
      const defaultBullet = isDash ? '- ' : '* ';
      const indent = '  '.repeat(depth);
      let out = '';
      let itemIdx = 1;

      const items = listElem.querySelectorAll(':scope > li');
      items.forEach(li => {
        let prefix = indent + (isOrdered ? (itemIdx++ + '. ') : defaultBullet);

        const checkbox = li.querySelector(':scope > input[type="checkbox"]');
        if (checkbox) {
          prefix = indent + (checkbox.checked ? '- [x] ' : '- [ ] ');
        }

        let itemContent = '';
        for (let i = 0; i < li.childNodes.length; i++) {
          const child = li.childNodes[i];
          if (child.nodeType === Node.ELEMENT_NODE && (child.tagName.toLowerCase() === 'ul' || child.tagName.toLowerCase() === 'ol')) {
            itemContent += '\n' + serializeList(child, depth + 1);
          } else if (child !== checkbox) {
            itemContent += serializeInline(child);
          }
        }
        out += prefix + itemContent.trim() + '\n';
      });
      return out;
    }

    function serializeTable(tableElem) {
      const rows = tableElem.querySelectorAll('tr');
      if (rows.length === 0) return '';
      const lines = [];

      rows.forEach((tr, rIdx) => {
        const cells = tr.querySelectorAll('th, td');
        const cellTexts = [];
        cells.forEach(cell => {
          cellTexts.push(serializeChildrenInline(cell).replace(/\|/g, '\\|').trim());
        });
        lines.push('| ' + cellTexts.join(' | ') + ' |');

        if (rIdx === 0) {
          const dividers = [];
          cells.forEach(cell => {
            const align = (cell.style.textAlign || cell.getAttribute('align') || '').toLowerCase();
            if (align === 'center') dividers.push(':---:');
            else if (align === 'right') dividers.push('---:');
            else dividers.push(':---');
          });
          lines.push('| ' + dividers.join(' | ') + ' |');
        }
      });

      return lines.join('\n');
    }

    let result = '';
    for (let i = 0; i < rootEl.childNodes.length; i++) {
      result += serializeBlock(rootEl.childNodes[i]);
    }
    return result.replace(/\n{3,}/g, '\n\n').trim() + '\n';
  }

  // Save Document to Disk via C# Host
  function saveDocument() {
    const isTxt = isPlainTextDoc(state.fileName);
    let contentToSave = '';

    if (state.isRawMode && el.rawEditor) {
      contentToSave = el.rawEditor.value;
    } else if (isTxt) {
      contentToSave = el.markdownBody.innerText;
    } else {
      if (state.isEditing) {
        contentToSave = htmlToMarkdown(el.markdownBody);
      } else {
        contentToSave = state.rawMarkdown;
      }
    }

    state.rawMarkdown = contentToSave;
    state.originalRaw = contentToSave;

    if (state.activeTabId) {
      const active = state.tabs.find(t => t.id === state.activeTabId);
      if (active) {
        active.rawMarkdown = contentToSave;
        active.originalRaw = contentToSave;
      }
    }

    if (window.chrome && window.chrome.webview) {
      try {
        if (state.filePath) {
          window.chrome.webview.postMessage('save_tab_file:' + state.filePath + '|' + contentToSave);
        } else {
          const suggested = state.fileName || (isTxt ? 'Yeni Belge.txt' : 'Yeni Belge.md');
          window.chrome.webview.postMessage('save_as:' + suggested + '|' + contentToSave);
          return;
        }
      } catch (e) {
        console.error('Failed to post save message:', e);
      }
    }

    setDirty(false);
    if (state.isRawMode) {
      toggleRawMode(false);
    }
    toggleEditMode(false);
    calculateStats(contentToSave);

    if (!isTxt) {
      buildTableOfContents();
      requestAnimationFrame(updateHeadingPositions);
    }

    const dict = I18N[state.lang || 'en'] || I18N.en;
    showToast(dict.saved_toast || 'Changes saved successfully!');
  }

  // Markdown Syntax Detector for TXT -> MD conversion
  function detectMarkdownSyntax(text) {
    if (!text) return false;
    const mdRegex = /(^#{1,6}\s+\S|^\s*[-*+]\s+\S|^\s*\d+\.\s+\S|^>\s+\S|\*\*[^*]+\*\*|__[^_]+__|(?<!\*)\*[^*\n]+\*(?!\*)|`{1,3}[^`\n]+`{1,3}|!?\[.+\]\(.+\)|\|.+\|.+\|)/m;
    return mdRegex.test(text);
  }

  // Bidirectional MD <-> TXT Conversion Handler
  function handleDocumentConversion() {
    if (el.dropdownMenu) el.dropdownMenu.classList.remove('show');
    const isTxt = isPlainTextDoc(state.fileName);
    const dict = I18N[state.lang || 'en'] || I18N.en;

    if (!isTxt) {
      // MD -> TXT Conversion: Warn and prompt for Rendered Text vs Raw Source
      const warnMsg = dict.convert_md_txt_warn || "Converting to plain text may result in loss of Markdown formatting. How would you like to save the document?";
      const optRendered = dict.convert_rendered_opt || "Rendered Text";
      const optRaw = dict.convert_raw_opt || "Raw Source";
      const optCancel = dict.btn_cancel || "Cancel";

      if (window.chrome && window.chrome.webview) {
        window.chrome.webview.postMessage('convert_prompt:md_to_txt|' + warnMsg + '|' + optRendered + '|' + optRaw + '|' + optCancel);
      } else {
        if (confirm(warnMsg + '\n\nOK = ' + optRendered + '\nCancel = ' + optRaw)) {
          (window.__NEOTEXT_ON_CONVERT_CHOICE__ || window.__NEOMD_ON_CONVERT_CHOICE__)('rendered');
        } else {
          (window.__NEOTEXT_ON_CONVERT_CHOICE__ || window.__NEOMD_ON_CONVERT_CHOICE__)('raw');
        }
      }
    } else {
      // TXT -> MD Conversion: Automatic syntax detection
      const currentText = state.isEditing ? (state.isRawMode ? el.rawEditor.value : el.markdownBody.innerText) : state.rawMarkdown;
      const hasMarkdown = detectMarkdownSyntax(currentText);
      const contentForMd = currentText;

      const suggestedName = (state.fileName || 'Document.txt').replace(/\.txt$/i, '.md');
      if (window.chrome && window.chrome.webview) {
        window.chrome.webview.postMessage('convert_txt_to_md:' + suggestedName + '|' + contentForMd);
      } else {
        alert('Converting TXT to MD (Detected MD syntax: ' + hasMarkdown + ')');
      }
    }
  }

  // Host Callbacks
  window.__NEOTEXT_TRIGGER_SAVE__ = window.__NEOMD_TRIGGER_SAVE__ = function() {
    saveDocument();
  };
  window.__NEOTEXT_GET_CONTENT__ = window.__NEOMD_GET_CONTENT__ = function() {
    const isTxt = isPlainTextDoc(state.fileName);
    if (state.isRawMode && el.rawEditor) return el.rawEditor.value;
    return isTxt ? el.markdownBody.innerText : htmlToMarkdown(el.markdownBody);
  };
  window.__NEOTEXT_ON_SAVE_SUCCESS__ = window.__NEOMD_ON_SAVE_SUCCESS__ = function() {
    const dict = I18N[state.lang || 'en'] || I18N.en;
    showToast(dict.saved_toast || 'Changes saved successfully!');
  };
  window.__NEOTEXT_ON_SAVE_AS_SUCCESS__ = window.__NEOMD_ON_SAVE_AS_SUCCESS__ = function(newPath, newName) {
    state.filePath = newPath;
    state.fileName = newName;
    if (el.documentTitle) el.documentTitle.textContent = newName;
    document.title = newName + ' - NeoText';
    if (el.statPath) el.statPath.textContent = newPath;
    setDirty(false);
    if (state.isRawMode) toggleRawMode(false);
    toggleEditMode(false);
    updateConvertButtonLabel();
    renderMarkdown();
    const dict = I18N[state.lang || 'en'] || I18N.en;
    showToast(dict.convert_success_toast || dict.saved_toast || 'Document saved successfully!');
  };

  // Callback from C# 3-button conversion dialog
  window.__NEOTEXT_ON_CONVERT_CHOICE__ = window.__NEOMD_ON_CONVERT_CHOICE__ = function(choice) {
    let content = '';
    if (choice === 'rendered') {
      content = el.markdownBody.innerText;
    } else if (choice === 'raw') {
      content = state.isEditing ? (state.isRawMode ? el.rawEditor.value : htmlToMarkdown(el.markdownBody)) : state.rawMarkdown;
    } else {
      return;
    }

    const suggestedName = (state.fileName || 'Document.md').replace(/\.md$/i, '.txt');
    if (window.chrome && window.chrome.webview) {
      window.chrome.webview.postMessage('save_converted_txt:' + suggestedName + '|' + content);
    }
  };

  window.__NEOTEXT_DETECT_MD__ = window.__NEOMD_DETECT_MD__ = detectMarkdownSyntax;
  window.__NEOTEXT_UPDATE_CONVERT_LABEL__ = window.__NEOMD_UPDATE_CONVERT_LABEL__ = updateConvertButtonLabel;

  // UI Scaling Controls
  const UI_SCALES = [80, 90, 100, 110, 120, 130];
  function applyUiScale(percent) {
    state.uiScale = percent;
    setStored('ui_scale', percent);
    document.documentElement.style.setProperty('--ui-scale', percent / 100);
    if (el.uiScaleDisplay) {
      el.uiScaleDisplay.textContent = percent + '%';
    }
    requestAnimationFrame(updateHeadingPositions);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    let next = 'dark';
    if (current === 'dark') next = 'oled';
    else if (current === 'oled') next = 'light';
    else next = 'dark';
    applyTheme(next, true);
  }

  function updateThemeIcon(effectiveTheme) {
    if (!el.themeIcon) return;
    if (effectiveTheme === 'dark') {
      // Moon icon for dark theme
      el.themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
    } else if (effectiveTheme === 'oled') {
      // OLED Pure Black icon: distinct concentric ring / solid dark aperture
      el.themeIcon.innerHTML = `<circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2" fill="none"></circle><circle cx="12" cy="12" r="4" fill="currentColor"></circle>`;
    } else {
      // Sun icon for light theme
      el.themeIcon.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
    }
  }

  // Reading Width Controls
  function applyWidth(widthValue) {
    state.width = widthValue;
    setStored('width', widthValue);
    document.documentElement.style.setProperty('--content-max-width', widthValue);

    el.widthPills.forEach(pill => {
      if (pill.dataset.width === widthValue) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    requestAnimationFrame(updateHeadingPositions);
  }

  // Font Size
  function applyFontSize(size) {
    state.fontSize = Math.min(24, Math.max(13, size));
    setStored('font_size', state.fontSize);
    document.documentElement.style.setProperty('--content-font-size', state.fontSize + 'px');
    if (el.fontSizeDisplay) el.fontSizeDisplay.textContent = state.fontSize + 'px';
    requestAnimationFrame(updateHeadingPositions);
  }

  // Sidebar Toggle
  function applySidebar(isOpen) {
    state.sidebarOpen = isOpen;
    setStored('sidebar', isOpen);
    if (isOpen) {
      el.sidebar.classList.remove('collapsed');
      if (state.workspaceFolderPath && window.chrome && window.chrome.webview) {
        window.chrome.webview.postMessage('scan_workspace_folder:' + state.workspaceFolderPath);
      }
    } else {
      el.sidebar.classList.add('collapsed');
    }
  }

  // Focus Search Tab
  function openSearchTab() {
    applySidebar(true);
    const searchTabBtn = document.querySelector('.tab-btn[data-tab="search"]');
    if (searchTabBtn) searchTabBtn.click();
    setTimeout(() => {
      if (el.searchInput) {
        el.searchInput.focus();
        el.searchInput.select();
      }
    }, 60);
  }

  // Live reload watcher
  function startFileWatcher() {
    const hash = (window.location.hash || '').replace(/^#/, '');
    const hashParams = new URLSearchParams(hash);
    const urlParams = new URLSearchParams(window.location.search);
    const sessionParam = state.sessionId || hashParams.get('s') || urlParams.get('s');
    const targetScript = sessionParam ? ('sessions/' + sessionParam + '.js') : 'active_data.js';

    setInterval(() => {
      if (!document.hasFocus()) return;
      const s = document.createElement('script');
      s.src = targetScript + '?t=' + Date.now();
      s.onload = function() {
        if (window.__NEOTEXT_RELOAD_REQ__ || window.__NEOMD_RELOAD_REQ__) {
          const savedScroll = el.viewport.scrollTop;
          renderData(window.__NEOTEXT_DATA__ || window.__NEOMD_DATA__);
          el.viewport.scrollTop = savedScroll;
          window.__NEOTEXT_RELOAD_REQ__ = window.__NEOMD_RELOAD_REQ__ = false;
        }
      };
      document.head.appendChild(s);
      setTimeout(() => s.remove(), 800);
    }, 2000);
  }

  function updateFloatingSaveButton() {
    if (!el.floatingSaveBtn) return;
    if (state.isEditing) {
      el.floatingSaveBtn.classList.add('visible');
    } else {
      el.floatingSaveBtn.classList.remove('visible');
    }
  }

  // ==========================================
  // NeoMD v2.0.0 - Multi-Tab Document Manager
  // ==========================================
  function initTabs() {
    if (el.tabNewBtn) {
      el.tabNewBtn.addEventListener('click', () => {
        createNewTab();
      });
    }

    if (el.tabsDropdownBtn) {
      el.tabsDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleTabsDropdown();
      });
    }

    if (el.tabsSearchInput) {
      el.tabsSearchInput.addEventListener('input', (e) => {
        renderTabsPopoverList(e.target.value);
      });
    }

    document.addEventListener('click', (e) => {
      if (el.tabsDropdownPopover && !e.target.closest('#tabs-dropdown-popover') && !e.target.closest('#tabs-dropdown-btn')) {
        el.tabsDropdownPopover.style.display = 'none';
      }
    });

    function triggerTabsBounce(direction) {
      if (!el.tabsList) return;
      const cls = direction === 'left' ? 'bounce-left' : 'bounce-right';
      el.tabsList.classList.remove('bounce-left', 'bounce-right');
      void el.tabsList.offsetWidth;
      el.tabsList.classList.add(cls);
      setTimeout(() => {
        if (el.tabsList) el.tabsList.classList.remove(cls);
      }, 260);
    }

    if (el.tabsScrollLeftBtn) {
      el.tabsScrollLeftBtn.addEventListener('click', () => {
        if (el.tabsList) {
          if (el.tabsList.scrollLeft <= 3) {
            triggerTabsBounce('left');
          } else {
            el.tabsList.scrollBy({ left: -140, behavior: 'smooth' });
          }
        }
      });
    }

    if (el.tabsScrollRightBtn) {
      el.tabsScrollRightBtn.addEventListener('click', () => {
        if (el.tabsList) {
          const maxScroll = el.tabsList.scrollWidth - el.tabsList.clientWidth;
          if (el.tabsList.scrollLeft >= maxScroll - 3) {
            triggerTabsBounce('right');
          } else {
            el.tabsList.scrollBy({ left: 140, behavior: 'smooth' });
          }
        }
      });
    }

    if (el.tabsList) {
      el.tabsList.addEventListener('scroll', () => {
        checkTabsOverflow();
      }, { passive: true });

      el.tabsList.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0) {
          e.preventDefault();
          el.tabsList.scrollLeft += e.deltaY;
          setTimeout(checkTabsOverflow, 50);
        }
      }, { passive: false });

      el.tabsList.addEventListener('dragover', (e) => {
        if (state.draggedTabId) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
        }
      });

      el.tabsList.addEventListener('drop', (e) => {
        // If dropped directly on empty space in tabsList (not on an existing doc-tab)
        if (e.target.closest('.doc-tab')) return;
        e.preventDefault();
        state.tabDragHandled = true;
        if (el.tabsList) el.tabsList.classList.remove('is-dragging');
        document.querySelectorAll('.doc-tab').forEach(t => t.classList.remove('drag-over-left', 'drag-over-right'));
        const sourceTabId = state.draggedTabId || e.dataTransfer.getData('text/plain');
        if (!sourceTabId) return;
        const srcIdx = state.tabs.findIndex(t => t.id === sourceTabId);
        if (srcIdx === -1 || srcIdx === state.tabs.length - 1) return;
        const [movedTab] = state.tabs.splice(srcIdx, 1);
        state.tabs.push(movedTab);
        renderTabsBar();
      });
    }

    window.addEventListener('resize', () => {
      checkTabsOverflow();
    });

    // Empty state buttons
    if (el.emptyNewBtn) {
      el.emptyNewBtn.addEventListener('click', () => {
        createNewTab();
      });
    }

    if (el.emptyOpenBtn) {
      el.emptyOpenBtn.addEventListener('click', () => {
        if (window.chrome && window.chrome.webview) {
          window.chrome.webview.postMessage('open_file_dialog');
        }
      });
    }

    // External Open Mode toggle
    initExternalModeToggle();

    // Global file drag-and-drop & Chrome-like tab tear-off on window/viewport
    window.addEventListener('dragover', (e) => {
      if (state.draggedTabId) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (e.screenX > 0 || e.screenY > 0) {
          state.lastDragScreenX = e.screenX;
          state.lastDragScreenY = e.screenY;
        }
        if (e.clientX !== 0 || e.clientY !== 0) {
          state.lastDragClientX = e.clientX;
          state.lastDragClientY = e.clientY;
        }
        return;
      }
      if (e.dataTransfer && e.dataTransfer.types && (e.dataTransfer.types.includes('Files') || e.dataTransfer.types.includes('text/plain'))) {
        e.preventDefault();
        if (el.emptyStateCard) el.emptyStateCard.classList.add('drag-over');
      }
    });

    window.addEventListener('dragleave', (e) => {
      if (e.clientX <= 0 || e.clientY <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
        if (el.emptyStateCard) el.emptyStateCard.classList.remove('drag-over');
      }
    });

    window.addEventListener('drop', (e) => {
      if (el.emptyStateCard) el.emptyStateCard.classList.remove('drag-over');

      // Chrome-like Tab Tear-Off when dropped below header into document / reading area / sidebar
      if (state.draggedTabId && state.tabs.length > 1) {
        if (!e.target.closest('#header-tabs-container')) {
          e.preventDefault();
          state.tabDragHandled = true;
          const tabToTear = state.tabs.find(t => t.id === state.draggedTabId);
          if (tabToTear) {
            const finalScreenX = (e.screenX > 0) ? e.screenX : (state.lastDragScreenX || -1);
            const finalScreenY = (e.screenY > 0) ? e.screenY : (state.lastDragScreenY || -1);
            tearOffTab(tabToTear, finalScreenX, finalScreenY);
          }
          return;
        }
      }

      // External file drop
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        e.preventDefault();
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          const file = e.dataTransfer.files[i];
          const reader = new FileReader();
          reader.onload = (re) => {
            openFileInTab('', file.name, re.target.result);
          };
          reader.readAsText(file);
        }
      }
    });

    window.__NEOTEXT_ON_SAVE_AS_SUCCESS__ = window.__NEOMD_ON_SAVE_AS_SUCCESS__ = function(newPath, newName) {
      state.filePath = newPath;
      state.fileName = newName;
      state.isDirty = false;
      state.originalRaw = state.rawMarkdown;
      if (state.activeTabId) {
        const active = state.tabs.find(t => t.id === state.activeTabId);
        if (active) {
          active.filePath = newPath;
          active.fileName = newName;
          active.isDirty = false;
          active.originalRaw = state.rawMarkdown;
        }
      }
      if (el.documentTitle) {
        el.documentTitle.textContent = state.fileName;
      }
      updateWindowTitle();
      updateConvertButtonLabel();
      setDirty(false);
      updateFloatingSaveButton();
      renderTabsBar();
      const dict = I18N[state.lang || 'en'] || I18N.en;
      showToast(dict.saved_toast || 'Changes saved successfully!');
    };
  }

  function initExternalModeToggle() {
    updateExternalModeUI();
    if (el.menuExternalModeBtn) {
      el.menuExternalModeBtn.addEventListener('click', () => {
        state.openExternalInTabs = !state.openExternalInTabs;
        setStored('external_open_mode', state.openExternalInTabs ? 'tab' : 'window');
        if (window.chrome && window.chrome.webview) {
          window.chrome.webview.postMessage('set_external_open_mode:' + (state.openExternalInTabs ? 'tab' : 'window'));
        }
        updateExternalModeUI();
        const dict = I18N[state.lang || 'en'] || I18N.en;
        const msg = state.openExternalInTabs
          ? (dict.external_mode_tab || 'External files open in tabs')
          : (dict.external_mode_window || 'External files open in new windows');
        showToast(msg);
      });
    }
  }

  function updateExternalModeUI() {
    const dict = I18N[state.lang || 'en'] || I18N.en;
    if (el.externalModeBadge) {
      el.externalModeBadge.textContent = state.openExternalInTabs
        ? (dict.external_mode_badge_tab || 'New Tab')
        : (dict.external_mode_badge_win || 'New Window');
      el.externalModeBadge.classList.toggle('window-mode', !state.openExternalInTabs);
    }
    if (el.menuExternalModeBtn) {
      el.menuExternalModeBtn.title = state.openExternalInTabs
        ? (dict.external_mode_tab || 'External Files: Open as new tab')
        : (dict.external_mode_window || 'External Files: Open as new window');
    }
  }

  function createNewTab(title, content, filePath) {
    const dict = I18N[state.lang || 'en'] || I18N.en;
    const tabCount = state.tabs.length + 1;
    const defaultName = title || `${dict.untitled_doc || 'Untitled'} ${tabCount}.md`;
    const tabId = 'tab_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);

    const newTab = {
      id: tabId,
      filePath: filePath || '',
      fileName: defaultName,
      rawMarkdown: (typeof content === 'string') ? content : '',
      originalRaw: (typeof content === 'string') ? content : '',
      isDirty: false,
      isEditing: false,
      isRawMode: false,
      scrollTop: 0
    };

    saveCurrentTabState();
    state.tabs.push(newTab);
    switchTab(tabId);
    return newTab;
  }

  function saveCurrentTabState() {
    if (!state.activeTabId) return;
    const active = state.tabs.find(t => t.id === state.activeTabId);
    if (!active) return;

    if (state.isEditing) {
      if (state.isRawMode && el.rawEditor) {
        state.rawMarkdown = el.rawEditor.value;
      } else if (el.markdownBody) {
        state.rawMarkdown = htmlToMarkdown(el.markdownBody);
      }
    }

    active.filePath = state.filePath;
    active.fileName = state.fileName;
    active.rawMarkdown = state.rawMarkdown;
    active.originalRaw = state.originalRaw;
    active.isDirty = state.isDirty;
    active.isEditing = state.isEditing;
    active.isRawMode = state.isRawMode;
    active.scrollTop = el.viewport ? el.viewport.scrollTop : 0;
  }

  function switchTab(tabId) {
    if (state.activeTabId === tabId && state.tabs.length > 0) return;

    saveCurrentTabState();

    const targetTab = state.tabs.find(t => t.id === tabId);
    if (!targetTab) return;

    state.activeTabId = tabId;
    state.filePath = targetTab.filePath;
    state.fileName = targetTab.fileName;
    state.rawMarkdown = targetTab.rawMarkdown;
    state.originalRaw = targetTab.originalRaw;
    state.isDirty = targetTab.isDirty;
    state.isEditing = targetTab.isEditing || false;
    state.isRawMode = targetTab.isRawMode || false;

    if (el.documentTitle) {
      el.documentTitle.textContent = state.fileName;
    }
    updateWindowTitle();
    updateConvertButtonLabel();

    renderMarkdown();

    if (el.viewport) {
      el.viewport.scrollTop = targetTab.scrollTop || 0;
    }

    toggleEditMode(state.isEditing);
    if (state.isEditing && state.isRawMode) {
      toggleRawMode(true);
    }
    updateFloatingSaveButton();
    renderTabsBar();
    calculateStats(state.rawMarkdown);
    const isTxt = isPlainTextDoc(state.fileName);
    if (!isTxt) {
      buildTableOfContents();
      requestAnimationFrame(updateHeadingPositions);
    }

    document.querySelectorAll('.tree-row').forEach(row => {
      if (row.dataset.path === state.filePath) {
        row.classList.add('active');
      } else {
        row.classList.remove('active');
      }
    });

    if (window.chrome && window.chrome.webview) {
      try {
        window.chrome.webview.postMessage(state.isDirty ? 'dirty:true' : 'dirty:false');
      } catch (e) {}
    }
  }

  function closeTab(tabId, skipConfirm = false) {
    const tabIndex = state.tabs.findIndex(t => t.id === tabId);
    if (tabIndex === -1) return;

    const tab = state.tabs[tabIndex];
    const dict = I18N[state.lang || 'en'] || I18N.en;

    if (tab.isDirty && !skipConfirm) {
      const confirmClose = window.confirm(
        `${tab.fileName}\n\n${dict.save_confirm_prompt || 'Değişiklikler kaydedilsin mi?'}\n(Kaydedilmemiş değişiklikler kaybolacak)`
      );
      if (!confirmClose) {
        return;
      }
    }

    state.tabs.splice(tabIndex, 1);

    if (state.tabs.length === 0) {
      state.activeTabId = null;
      state.filePath = '';
      state.fileName = 'NeoText';
      state.rawMarkdown = '';
      state.originalRaw = '';
      state.isDirty = false;
      renderTabsBar();
      updateWindowTitle();
      return;
    }

    if (state.activeTabId === tabId) {
      const nextIndex = Math.min(tabIndex, state.tabs.length - 1);
      switchTab(state.tabs[nextIndex].id);
    } else {
      renderTabsBar();
    }
  }

  function getFileTypeTag(fileName) {
    if (!fileName) return 'MD';
    const parts = fileName.split('.');
    if (parts.length > 1) {
      const ext = parts.pop().toUpperCase();
      return ext.length <= 4 ? ext : ext.substring(0, 3);
    }
    return 'MD';
  }

  function renderTabsBar() {
    const dict = I18N[state.lang || 'en'] || I18N.en;

    // 0 tabs: Empty State View
    if (state.tabs.length === 0) {
      if (el.headerTabsContainer) el.headerTabsContainer.classList.add('hidden');
      if (el.singleDocTitle) {
        el.singleDocTitle.classList.remove('hidden');
        if (el.documentTitle) el.documentTitle.textContent = 'NeoText';
      }
      if (el.tabsDropdownBtn) el.tabsDropdownBtn.classList.remove('visible');
      if (el.tabsScrollLeftBtn) el.tabsScrollLeftBtn.classList.remove('visible');
      if (el.tabsScrollRightBtn) el.tabsScrollRightBtn.classList.remove('visible');
      if (el.emptyStateView) el.emptyStateView.style.display = 'flex';
      if (el.outlineStatsCard) el.outlineStatsCard.classList.add('empty-hidden');
      if (el.markdownBody) el.markdownBody.style.display = 'none';
      if (el.rawEditor) el.rawEditor.style.display = 'none';
      if (el.floatingSaveBtn) el.floatingSaveBtn.classList.remove('visible');
      if (el.editToolbar) el.editToolbar.classList.remove('visible');
      return;
    }

    // Hide empty state view if there are tabs
    if (el.emptyStateView) el.emptyStateView.style.display = 'none';
    if (el.outlineStatsCard) el.outlineStatsCard.classList.remove('empty-hidden');
    if (state.isEditing && state.isRawMode) {
      if (el.rawEditor) el.rawEditor.style.display = 'block';
      if (el.markdownBody) el.markdownBody.style.display = 'none';
    } else {
      if (el.markdownBody) el.markdownBody.style.display = 'block';
      if (el.rawEditor) el.rawEditor.style.display = 'none';
    }

    // Single tab mode: show single doc title, hide tabs container
    if (state.tabs.length === 1) {
      if (el.headerTabsContainer) el.headerTabsContainer.classList.add('hidden');
      if (el.singleDocTitle) {
        el.singleDocTitle.classList.remove('hidden');
        if (el.documentTitle) el.documentTitle.textContent = state.fileName || 'NeoText';
      }
      if (el.tabsDropdownBtn) el.tabsDropdownBtn.classList.remove('visible');
      if (el.tabsScrollLeftBtn) el.tabsScrollLeftBtn.classList.remove('visible');
      if (el.tabsScrollRightBtn) el.tabsScrollRightBtn.classList.remove('visible');
      return;
    }

    // Multi-tab mode (>= 2 tabs): hide single doc title, show tabs container
    if (el.singleDocTitle) el.singleDocTitle.classList.add('hidden');
    if (el.headerTabsContainer) el.headerTabsContainer.classList.remove('hidden');

    if (!el.tabsList) return;

    // Reconciliation: map existing tab elements
    const existingElements = new Map();
    el.tabsList.querySelectorAll('.doc-tab').forEach(item => {
      existingElements.set(item.dataset.tabId, item);
    });

    let activeTabElement = null;

    state.tabs.forEach((tab, index) => {
      let tabEl = existingElements.get(tab.id);
      const isNew = !tabEl;
      const typeTag = getFileTypeTag(tab.fileName);

      if (isNew) {
        tabEl = document.createElement('div');
        tabEl.className = 'doc-tab tab-entering' + (tab.id === state.activeTabId ? ' active' : '') + (tab.isDirty ? ' is-dirty' : '');
        tabEl.dataset.tabId = tab.id;
        tabEl.setAttribute('draggable', 'true');

        tabEl.innerHTML = `
          <span class="doc-tab-type-tag">${typeTag}</span>
          <span class="doc-tab-title" title="${escapeHtml(tab.filePath || tab.fileName)}">${escapeHtml(tab.fileName)}</span>
          <span class="doc-tab-dirty"></span>
          <button class="doc-tab-close" title="${dict.close_tab_title || 'Close (Ctrl+W)'}">&times;</button>
        `;

        tabEl.addEventListener('click', (e) => {
          if (e.target.closest('.doc-tab-close')) return;
          switchTab(tab.id);
        });

        tabEl.addEventListener('auxclick', (e) => {
          if (e.button === 1) {
            e.preventDefault();
            closeTab(tab.id);
          }
        });

        const closeBtn = tabEl.querySelector('.doc-tab-close');
        if (closeBtn) {
          closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeTab(tab.id);
          });
        }

        // Drag & Drop for reordering and tear-off
        tabEl.addEventListener('dragstart', (e) => {
          state.draggedTabId = tab.id;
          state.tabDragHandled = false;
          if (e.screenX > 0 || e.screenY > 0) {
            state.lastDragScreenX = e.screenX;
            state.lastDragScreenY = e.screenY;
          }
          tabEl.classList.add('dragging');
          if (el.tabsList) el.tabsList.classList.add('is-dragging');
          e.dataTransfer.setData('text/plain', tab.id);
          e.dataTransfer.effectAllowed = 'move';
        });

        tabEl.addEventListener('drag', (e) => {
          if (e.screenX > 0 || e.screenY > 0) {
            state.lastDragScreenX = e.screenX;
            state.lastDragScreenY = e.screenY;
          }
          if (e.clientX !== 0 || e.clientY !== 0) {
            state.lastDragClientX = e.clientX;
            state.lastDragClientY = e.clientY;
          }
        });

        tabEl.addEventListener('dragend', (e) => {
          tabEl.classList.remove('dragging');
          if (el.tabsList) el.tabsList.classList.remove('is-dragging');
          document.querySelectorAll('.doc-tab').forEach(t => t.classList.remove('drag-over-left', 'drag-over-right'));

          // Chrome-like tear-off:
          // If not dropped inside tab bar to reorder, and released outside header or outside window bounds
          if (!state.tabDragHandled && state.tabs.length > 1) {
            const headerRect = el.headerTabsContainer
              ? el.headerTabsContainer.getBoundingClientRect()
              : { top: 0, bottom: 48, left: 0, right: window.innerWidth };

            const curClientX = (e.clientX !== 0 || e.clientY !== 0) ? e.clientX : (state.lastDragClientX || 0);
            const curClientY = (e.clientX !== 0 || e.clientY !== 0) ? e.clientY : (state.lastDragClientY || 0);
            const curScreenX = (e.screenX > 0) ? e.screenX : (state.lastDragScreenX || -1);
            const curScreenY = (e.screenY > 0) ? e.screenY : (state.lastDragScreenY || -1);

            const droppedOutsideHeader = (curClientY > headerRect.bottom + 15 || curClientY < headerRect.top - 10 || curClientX < headerRect.left - 10 || curClientX > headerRect.right + 10);
            const droppedOutsideWindow = (
              curScreenX > 0 && (
                curScreenX < window.screenX || curScreenX > window.screenX + window.outerWidth ||
                curScreenY < window.screenY || curScreenY > window.screenY + window.outerHeight
              )
            );

            if (droppedOutsideHeader || droppedOutsideWindow) {
              state.tabDragHandled = true;
              tearOffTab(tab, curScreenX, curScreenY);
            }
          }

          state.draggedTabId = null;
          state.tabDragHandled = false;
        });

        tabEl.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          const rect = tabEl.getBoundingClientRect();
          const mid = rect.left + rect.width / 2;
          if (e.clientX < mid) {
            tabEl.classList.add('drag-over-left');
            tabEl.classList.remove('drag-over-right');
          } else {
            tabEl.classList.add('drag-over-right');
            tabEl.classList.remove('drag-over-left');
          }
        });

        tabEl.addEventListener('dragleave', () => {
          tabEl.classList.remove('drag-over-left', 'drag-over-right');
        });

        tabEl.addEventListener('drop', (e) => {
          e.preventDefault();
          e.stopPropagation();
          state.tabDragHandled = true;
          tabEl.classList.remove('drag-over-left', 'drag-over-right');
          if (el.tabsList) el.tabsList.classList.remove('is-dragging');
          const sourceTabId = state.draggedTabId || e.dataTransfer.getData('text/plain');
          if (!sourceTabId || sourceTabId === tab.id) return;

          const srcIdx = state.tabs.findIndex(t => t.id === sourceTabId);
          const dstIdx = state.tabs.findIndex(t => t.id === tab.id);
          if (srcIdx === -1 || dstIdx === -1) return;

          const rect = tabEl.getBoundingClientRect();
          const isAfter = e.clientX >= (rect.left + rect.width / 2);
          let targetSlot = isAfter ? dstIdx + 1 : dstIdx;

          const [movedTab] = state.tabs.splice(srcIdx, 1);
          if (srcIdx < targetSlot) targetSlot--;
          state.tabs.splice(targetSlot, 0, movedTab);

          renderTabsBar();
        });

        setTimeout(() => {
          if (tabEl) tabEl.classList.remove('tab-entering');
        }, 240);
      } else {
        // Update existing element
        tabEl.classList.toggle('active', tab.id === state.activeTabId);
        tabEl.classList.toggle('is-dirty', !!tab.isDirty);

        const titleEl = tabEl.querySelector('.doc-tab-title');
        if (titleEl && titleEl.textContent !== tab.fileName) {
          titleEl.textContent = tab.fileName;
          titleEl.title = tab.filePath || tab.fileName;
        }

        const tagEl = tabEl.querySelector('.doc-tab-type-tag');
        if (tagEl && tagEl.textContent !== typeTag) {
          tagEl.textContent = typeTag;
        }

        existingElements.delete(tab.id);
      }

      // Ensure proper DOM position
      if (el.tabsList.children[index] !== tabEl) {
        el.tabsList.insertBefore(tabEl, el.tabsList.children[index] || null);
      }

      if (tab.id === state.activeTabId) {
        activeTabElement = tabEl;
      }
    });

    // Remove any leftover tabs that were closed
    existingElements.forEach(item => item.remove());

    checkTabsOverflow();

    if (activeTabElement && el.tabsList) {
      const scrollActiveIntoView = () => {
        if (!activeTabElement || !el.tabsList) return;
        const tabRect = activeTabElement.getBoundingClientRect();
        const listRect = el.tabsList.getBoundingClientRect();
        if (tabRect.right > listRect.right - 20) {
          el.tabsList.scrollLeft += (tabRect.right - listRect.right) + 60;
        } else if (tabRect.left < listRect.left + 20) {
          el.tabsList.scrollLeft -= (listRect.left - tabRect.left) + 60;
        }
      };
      scrollActiveIntoView();
      setTimeout(scrollActiveIntoView, 80);
      setTimeout(scrollActiveIntoView, 220);
    }

    requestAnimationFrame(checkTabsOverflow);
  }

  function checkTabsOverflow() {
    if (!el.tabsList || state.tabs.length <= 1) {
      if (el.tabsDropdownBtn) el.tabsDropdownBtn.classList.remove('visible');
      if (el.tabsScrollLeftBtn) el.tabsScrollLeftBtn.classList.remove('visible');
      if (el.tabsScrollRightBtn) el.tabsScrollRightBtn.classList.remove('visible');
      if (el.headerTabsContainer) el.headerTabsContainer.classList.remove('overflowing');
      return;
    }

    const isOverflowing = el.tabsList.scrollWidth > el.tabsList.clientWidth + 4 || state.tabs.length >= 5;
    if (el.headerTabsContainer) {
      if (isOverflowing) el.headerTabsContainer.classList.add('overflowing');
      else el.headerTabsContainer.classList.remove('overflowing');
    }

    if (el.tabsDropdownBtn) {
      if (isOverflowing) el.tabsDropdownBtn.classList.add('visible');
      else el.tabsDropdownBtn.classList.remove('visible');
    }

    if (isOverflowing) {
      if (el.tabsScrollLeftBtn) el.tabsScrollLeftBtn.classList.add('visible');
      if (el.tabsScrollRightBtn) el.tabsScrollRightBtn.classList.add('visible');
    } else {
      if (el.tabsScrollLeftBtn) el.tabsScrollLeftBtn.classList.remove('visible');
      if (el.tabsScrollRightBtn) el.tabsScrollRightBtn.classList.remove('visible');
    }
  }

  function tearOffTab(tab, screenX, screenY) {
    if (!tab || state.tabs.length <= 1) return;
    if (tab.id === state.activeTabId) {
      saveCurrentTabState();
    }
    if (window.chrome && window.chrome.webview) {
      const payload = JSON.stringify({
        filePath: tab.filePath || '',
        fileName: tab.fileName || 'Yeni Belge.md',
        content: tab.rawMarkdown || '',
        isDirty: !!tab.isDirty,
        screenX: (typeof screenX === 'number' && screenX > 0) ? Math.round(screenX) : -1,
        screenY: (typeof screenY === 'number' && screenY > 0) ? Math.round(screenY) : -1
      });
      window.chrome.webview.postMessage('tear_off_tab:' + payload);
      closeTab(tab.id, true);
    }
  }

  window.closeTab = closeTab;
  window.createNewTab = createNewTab;
  window.switchTab = switchTab;
  window.tearOffTab = tearOffTab;

  function toggleTabsDropdown(show) {
    if (!el.tabsDropdownPopover) return;
    const isVisible = (typeof show === 'boolean') ? show : (el.tabsDropdownPopover.style.display !== 'none');
    if (isVisible) {
      el.tabsDropdownPopover.style.display = 'none';
    } else {
      el.tabsDropdownPopover.style.display = 'flex';
      renderTabsPopoverList();
      if (el.tabsSearchInput) {
        el.tabsSearchInput.value = '';
        el.tabsSearchInput.focus();
      }
    }
  }

  function renderTabsPopoverList(filter = '') {
    if (!el.tabsPopoverList) return;
    el.tabsPopoverList.innerHTML = '';
    const q = (filter || '').trim().toLowerCase();

    state.tabs.forEach(tab => {
      if (q && !tab.fileName.toLowerCase().includes(q)) return;

      const item = document.createElement('div');
      item.className = 'tabs-popover-item' + (tab.id === state.activeTabId ? ' active' : '');
      item.innerHTML = `
        <span class="tabs-popover-item-title">${escapeHtml(tab.fileName)} ${tab.isDirty ? '●' : ''}</span>
        <button class="doc-tab-close" style="font-size: 13px;">&times;</button>
      `;

      item.addEventListener('click', (e) => {
        if (e.target.closest('.doc-tab-close')) return;
        switchTab(tab.id);
        toggleTabsDropdown(false);
      });

      const closeBtn = item.querySelector('.doc-tab-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          closeTab(tab.id);
          renderTabsPopoverList(el.tabsSearchInput ? el.tabsSearchInput.value : '');
        });
      }

      el.tabsPopoverList.appendChild(item);
    });
  }

  // ==========================================
  // NeoMD v2.0.0 - Workspace & Folder Tree
  // ==========================================
  function initWorkspace() {
    if (el.workspaceOpenFileBtn) {
      el.workspaceOpenFileBtn.addEventListener('click', () => {
        if (window.chrome && window.chrome.webview) {
          window.chrome.webview.postMessage('open_file_dialog');
        }
      });
    }

    if (el.openWorkspaceBtn) {
      el.openWorkspaceBtn.addEventListener('click', () => {
        if (window.chrome && window.chrome.webview) {
          window.chrome.webview.postMessage('open_workspace_folder');
        }
      });
    }

    if (el.menuOpenFolderBtn) {
      el.menuOpenFolderBtn.addEventListener('click', () => {
        if (el.dropdownMenu) el.dropdownMenu.classList.remove('show');
        if (window.chrome && window.chrome.webview) {
          window.chrome.webview.postMessage('open_workspace_folder');
        }
      });
    }

    if (el.refreshWorkspaceBtn) {
      el.refreshWorkspaceBtn.addEventListener('click', () => {
        if (state.workspaceFolderPath && window.chrome && window.chrome.webview) {
          window.chrome.webview.postMessage('scan_workspace_folder:' + state.workspaceFolderPath);
        }
      });
    }

    if (el.workspaceFolderName && (state.workspaceFolderName || state.workspaceFolderPath)) {
      const initName = state.workspaceFolderName || state.workspaceFolderPath.split(/[/\\]/).filter(Boolean).pop() || state.workspaceFolderPath;
      el.workspaceFolderName.textContent = initName;
      el.workspaceFolderName.title = state.workspaceFolderPath;
    }

    // Register WebMessageReceived listener for robust JSON IPC
    if (window.chrome && window.chrome.webview) {
      window.chrome.webview.addEventListener('message', (event) => {
        let msg = event.data;
        if (typeof msg === 'string') {
          try { msg = JSON.parse(msg); } catch (e) {}
        }
        if (!msg || typeof msg !== 'object') return;

        if (msg.type === 'open_file_content') {
          openFileInTab(msg.filePath, msg.fileName, msg.content);
        } else if (msg.type === 'workspace_tree') {
          state.workspaceFolderPath = msg.folderPath || '';
          state.workspaceFolderName = msg.folderName || '';
          state.workspaceTree = msg.tree || null;
          setStored('workspace_folder', state.workspaceFolderPath);
          setStored('workspace_folder_name', state.workspaceFolderName);

          if (el.workspaceFolderName) {
            el.workspaceFolderName.textContent = state.workspaceFolderName || msg.folderPath;
            el.workspaceFolderName.title = msg.folderPath;
          }

          renderWorkspaceTree(state.workspaceTree);
        }
      });
    }

    window.__NEOTEXT_ON_WORKSPACE_LOADED__ = window.__NEOMD_ON_WORKSPACE_LOADED__ = function(data) {
      if (!data) return;
      state.workspaceFolderPath = data.folderPath || '';
      state.workspaceFolderName = data.folderName || '';
      state.workspaceTree = data.tree || null;
      setStored('workspace_folder', state.workspaceFolderPath);
      setStored('workspace_folder_name', state.workspaceFolderName);

      if (el.workspaceFolderName) {
        el.workspaceFolderName.textContent = state.workspaceFolderName || data.folderPath;
        el.workspaceFolderName.title = data.folderPath;
      }

      renderWorkspaceTree(state.workspaceTree);

      const filesTabBtn = document.getElementById('tab-btn-files');
      if (filesTabBtn && !filesTabBtn.classList.contains('active')) {
        filesTabBtn.click();
      }
    };

    window.__NEOTEXT_ON_FILE_READ__ = window.__NEOMD_ON_FILE_READ__ = function(data) {
      if (!data || !data.filePath) return;
      openFileInTab(data.filePath, data.fileName, data.content);
    };

    window.__NEOTEXT_ON_TAB_SAVED__ = window.__NEOMD_ON_TAB_SAVED__ = function(savedPath) {
      const tab = state.tabs.find(t => t.filePath === savedPath);
      if (tab) {
        tab.isDirty = false;
        tab.originalRaw = tab.rawMarkdown;
      }
      if (state.filePath === savedPath) {
        state.isDirty = false;
        state.originalRaw = state.rawMarkdown;
        updateFloatingSaveButton();
        if (window.chrome && window.chrome.webview) {
          try { window.chrome.webview.postMessage('dirty:false'); } catch (e) {}
        }
      }
      renderTabsBar();
      const dict = I18N[state.lang || 'en'] || I18N.en;
      showToast(dict.saved_toast || 'Changes saved successfully!');
    };

    if (state.workspaceFolderPath && window.chrome && window.chrome.webview) {
      window.chrome.webview.postMessage('scan_workspace_folder:' + state.workspaceFolderPath);
    }
  }

  function renderWorkspaceTree(rootNode) {
    if (!el.folderTreeRoot) return;
    el.folderTreeRoot.innerHTML = '';
    const dict = I18N[state.lang || 'en'] || I18N.en;

    if (!rootNode || !rootNode.children || rootNode.children.length === 0) {
      el.folderTreeRoot.innerHTML = `<div class="folder-tree-empty">${dict.folder_tree_empty_hint || 'Notlarınızı ve dosyalarınızı ağaç olarak görmek için bir klasör seçin.'}</div>`;
      return;
    }

    const fragment = document.createDocumentFragment();
    rootNode.children.forEach(child => {
      fragment.appendChild(buildTreeNodeElement(child));
    });
    el.folderTreeRoot.appendChild(fragment);
  }

  function buildTreeNodeElement(node) {
    const nodeEl = document.createElement('div');
    nodeEl.className = 'tree-node' + (node.isDirectory ? '' : ' tree-file');

    const row = document.createElement('div');
    row.className = 'tree-row' + (state.filePath === node.path ? ' active' : '');
    row.dataset.path = node.path;

    if (node.isDirectory) {
      row.innerHTML = `
        <span class="tree-chevron">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </span>
        <span class="tree-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
        </span>
        <span class="tree-name" title="${escapeHtml(node.path)}">${escapeHtml(node.name)}</span>
      `;

      row.addEventListener('click', (e) => {
        e.stopPropagation();
        nodeEl.classList.toggle('expanded');
      });

      nodeEl.appendChild(row);

      const childrenContainer = document.createElement('div');
      childrenContainer.className = 'tree-children';
      if (node.children && node.children.length > 0) {
        node.children.forEach(child => {
          childrenContainer.appendChild(buildTreeNodeElement(child));
        });
      }
      nodeEl.appendChild(childrenContainer);
    } else {
      const ext = (node.ext || '').toLowerCase();
      let iconSvg = '';
      if (ext === '.md' || ext === '.markdown') {
        iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"></rect><polyline points="7 15 7 9 10 12 13 9 13 15"></polyline><polyline points="17 11 17 15"></polyline></svg>`;
      } else if (ext === '.txt') {
        iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`;
      } else if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].includes(ext)) {
        iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`;
      } else {
        iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>`;
      }

      row.innerHTML = `
        <span class="tree-chevron" style="visibility: hidden;"></span>
        <span class="tree-icon">${iconSvg}</span>
        <span class="tree-name" title="${escapeHtml(node.path)}">${escapeHtml(node.name)}</span>
      `;

      const handleFileClick = (e) => {
        e.stopPropagation();
        document.querySelectorAll('.tree-row.active').forEach(r => r.classList.remove('active'));
        row.classList.add('active');

        const isImage = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].includes(ext);
        if (isImage) {
          let relPath = node.path;
          if (state.filePath) {
            const lastSlash = Math.max(state.filePath.lastIndexOf('\\'), state.filePath.lastIndexOf('/'));
            const parentDir = (lastSlash >= 0) ? state.filePath.substring(0, lastSlash) : '';
            if (parentDir && node.path.toLowerCase().startsWith(parentDir.toLowerCase())) {
              relPath = node.path.substring(parentDir.length).replace(/^[\\\/]+/, '').replace(/\\/g, '/');
            }
          }
          if (state.isEditing) {
            insertImageMarkdown(relPath, node.name);
            const dict = I18N[state.lang || 'en'] || I18N.en;
            showToast((dict.toast_image_inserted || 'Görsel eklendi: ') + node.name);
          } else {
            const dict = I18N[state.lang || 'en'] || I18N.en;
            showToast((dict.toast_image_file || 'Görsel dosyası: ') + node.name);
          }
          return;
        }

        const normNodePath = (node.path || '').toLowerCase();
        const existingTab = state.tabs.find(t => (t.filePath || '').toLowerCase() === normNodePath);
        if (existingTab) {
          switchTab(existingTab.id);
        } else {
          if (window.chrome && window.chrome.webview) {
            window.chrome.webview.postMessage('read_file_content:' + node.path);
          }
        }
      };

      row.addEventListener('click', handleFileClick);
      row.addEventListener('dblclick', handleFileClick);

      nodeEl.appendChild(row);
    }

    return nodeEl;
  }

  function openFileInTab(filePath, fileName, content) {
    const existing = state.tabs.find(t => t.filePath === filePath);
    if (existing) {
      existing.rawMarkdown = content;
      existing.originalRaw = content;
      switchTab(existing.id);
      return;
    }

    if (state.tabs.length === 1) {
      const cur = state.tabs[0];
      if (!cur.filePath && !cur.isDirty && (!cur.rawMarkdown || !cur.rawMarkdown.trim())) {
        cur.filePath = filePath;
        cur.fileName = fileName;
        cur.rawMarkdown = content;
        cur.originalRaw = content;
        switchTab(cur.id);
        return;
      }
    }

    const tab = createNewTab(fileName, content, filePath);
    switchTab(tab.id);
  }

  // ==========================================
  // NeoMD v2.0.0 - Smart Image Paste & Assets
  // ==========================================
  function initImagePasteHandler() {
    window.__NEOTEXT_ON_IMAGE_SAVED__ = window.__NEOMD_ON_IMAGE_SAVED__ = function(res) {
      if (res && res.success && res.relativePath) {
        const dict = I18N[state.lang || 'en'] || I18N.en;
        showToast((dict.toast_image_saved || 'Görsel kaydedildi: ') + res.relativePath);
      }
    };

    document.addEventListener('paste', function(e) {
      if (!e.clipboardData || !e.clipboardData.items) return;
      const items = e.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault();
          const file = items[i].getAsFile();
          if (file) {
            processImageFile(file);
          }
          break;
        }
      }
    });

    window.addEventListener('dragover', function(e) {
      if (e.dataTransfer && e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files')) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      }
    });

    window.addEventListener('drop', function(e) {
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
          e.preventDefault();
          processImageFile(file);
        }
      }
    });
  }

  function processImageFile(file) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      const dataUrl = evt.target.result;
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
      const ext = (file.type === 'image/jpeg') ? 'jpg' : (file.type === 'image/gif' ? 'gif' : 'png');
      const filename = `img_${timestamp}.${ext}`;

      if (state.filePath) {
        const lastSlash = Math.max(state.filePath.lastIndexOf('\\'), state.filePath.lastIndexOf('/'));
        const docDir = (lastSlash >= 0) ? state.filePath.substring(0, lastSlash) : '';
        const assetsDir = docDir ? (docDir + '\\assets') : 'assets';
        const relativeImgPath = `assets/${filename}`;

        if (window.chrome && window.chrome.webview) {
          window.chrome.webview.postMessage(`save_clipboard_image:${assetsDir}|${filename}|${dataUrl}`);
        }

        insertImageMarkdown(relativeImgPath, filename);
      } else {
        insertImageMarkdown(dataUrl, filename);
      }
    };
    reader.readAsDataURL(file);
  }

  function insertImageMarkdown(imgSrc, altText) {
    const mdImg = `![${altText || 'Image'}](${imgSrc})\n`;

    if (state.isEditing) {
      if (state.isRawMode && el.rawEditor) {
        const start = el.rawEditor.selectionStart;
        const end = el.rawEditor.selectionEnd;
        const val = el.rawEditor.value;
        el.rawEditor.value = val.substring(0, start) + mdImg + val.substring(end);
        el.rawEditor.selectionStart = el.rawEditor.selectionEnd = start + mdImg.length;
        el.rawEditor.focus();
        setDirty(true);
      } else if (el.markdownBody) {
        document.execCommand('insertHTML', false, `<img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(altText)}" style="max-width: 100%; border-radius: 6px; margin: 8px 0;" />`);
        setDirty(true);
      }
    } else {
      state.rawMarkdown = (state.rawMarkdown || '') + '\n\n' + mdImg;
      setDirty(true);
      renderMarkdown();
    }
  }

  // Event Listeners
  function setupEventListeners() {
    // Sidebar toggle
    el.sidebarToggleBtn.addEventListener('click', () => {
      applySidebar(!state.sidebarOpen);
    });

    // Edit mode toggle
    if (el.editBtn) {
      el.editBtn.addEventListener('click', () => {
        toggleEditMode();
      });
    }

    // Floating save button
    if (el.floatingSaveBtn) {
      el.floatingSaveBtn.addEventListener('click', () => {
        saveDocument();
      });
    }

    // Formatting Toolbar Buttons
    if (el.toolBtns) {
      el.toolBtns.forEach(btn => {
        btn.addEventListener('mousedown', (e) => {
          e.preventDefault();
        });
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const tool = btn.dataset.tool;
          if (tool === 'raw') {
            toggleRawMode();
          } else if (tool === 'ul') {
            toggleBulletPopover();
          } else if (state.isRawMode) {
            insertRawPattern(tool);
          } else {
            formatVisual(tool);
          }
        });
      });
    }

    // Bullet List Popover Selection Handlers
    if (el.toolPopoverItems) {
      el.toolPopoverItems.forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const bulletType = item.dataset.bulletType || 'dash';
          closeBulletPopover();
          if (state.isRawMode) {
            if (bulletType === 'numbered') {
              insertRawPattern('ol');
            } else {
              insertRawPattern(bulletType === 'dash' ? 'ul-dash' : 'ul-dot');
            }
          } else {
            formatVisualList(bulletType);
          }
        });
      });
    }

    // Close bullet popover when clicking outside or pressing Escape
    document.addEventListener('click', (e) => {
      if (el.toolUlPopover && el.toolUlPopover.classList.contains('visible')) {
        if (!e.target.closest('.tool-dropdown-wrapper')) {
          closeBulletPopover();
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeBulletPopover();
      }
    });

    // Code block language double-click in-place editing & toolbar active state tracking
    if (el.markdownBody) {
      el.markdownBody.addEventListener('dblclick', (e) => {
        const span = e.target.closest('.code-header span');
        if (span && state.isEditing && !state.isRawMode) {
          e.preventDefault();
          e.stopPropagation();
          makeLanguageBadgeEditable(span);
        }
      });

      el.markdownBody.addEventListener('keyup', updateToolbarActiveStates);
      el.markdownBody.addEventListener('mouseup', updateToolbarActiveStates);
    }

    // Viewport background click in edit mode -> focus document body and place caret
    if (el.viewport) {
      el.viewport.addEventListener('click', (e) => {
        if (state.isEditing && !state.isRawMode && (e.target === el.viewport || e.target === el.markdownBody)) {
          focusEditable(el.markdownBody, true);
        }
      });
    }

    document.addEventListener('selectionchange', updateToolbarActiveStates);

    // Raw Editor Textarea Events (Tab key support, auto-resize & dirty state)
    if (el.rawEditor) {
      el.rawEditor.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          e.preventDefault();
          const start = el.rawEditor.selectionStart;
          const end = el.rawEditor.selectionEnd;
          el.rawEditor.setRangeText('  ', start, end, 'end');
          autoResizeRawEditor();
          setDirty(true);
        }
      });

      el.rawEditor.addEventListener('input', () => {
        autoResizeRawEditor();
        if (!state.isDirty) {
          setDirty(true);
        }
      });
    }

    // Document dirty state tracking
    if (el.markdownBody) {
      el.markdownBody.addEventListener('input', () => {
        if (!state.isDirty) {
          setDirty(true);
        }
      });
    }

    // Theme toggle
    el.themeToggleBtn.addEventListener('click', toggleTheme);

    // Width selector pills
    el.widthPills.forEach(pill => {
      pill.addEventListener('click', () => {
        applyWidth(pill.dataset.width);
      });
    });

    // Sidebar Tabs
    el.tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        el.tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        el.sidebarPanes.forEach(pane => {
          if (pane.id === `tab-pane-${targetTab}`) {
            pane.classList.add('active');
          } else {
            pane.classList.remove('active');
          }
        });

        if (targetTab === 'files') {
          if (state.workspaceFolderPath && window.chrome && window.chrome.webview) {
            window.chrome.webview.postMessage('scan_workspace_folder:' + state.workspaceFolderPath);
          }
        }

        if (targetTab === 'search') {
          setTimeout(() => {
            el.searchInput.focus();
            el.searchInput.select();
          }, 50);
        }
      });
    });

    // Search input
    let searchDebounce = null;
    el.searchInput.addEventListener('input', (e) => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => performSearch(e.target.value), 180);
    });

    el.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (state.searchMatches.length === 0) return;
        if (e.shiftKey) {
          state.currentSearchIdx = (state.currentSearchIdx - 1 + state.searchMatches.length) % state.searchMatches.length;
        } else {
          state.currentSearchIdx = (state.currentSearchIdx + 1) % state.searchMatches.length;
        }
        selectSearchMatch(state.currentSearchIdx);
      }
    });

    el.searchNextBtn.addEventListener('click', () => {
      if (state.searchMatches.length === 0) return;
      state.currentSearchIdx = (state.currentSearchIdx + 1) % state.searchMatches.length;
      selectSearchMatch(state.currentSearchIdx);
    });

    el.searchPrevBtn.addEventListener('click', () => {
      if (state.searchMatches.length === 0) return;
      state.currentSearchIdx = (state.currentSearchIdx - 1 + state.searchMatches.length) % state.searchMatches.length;
      selectSearchMatch(state.currentSearchIdx);
    });

    // Menu dropdown - Prevent closing when clicking inside!
    el.menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      el.dropdownMenu.classList.toggle('show');
    });

    el.dropdownMenu.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevents menu from disappearing when clicking font +/-!
    });

    document.addEventListener('click', () => {
      el.dropdownMenu.classList.remove('show');
    });

    // Language Selector (Native & Custom Dropdown)
    if (el.langSelect) {
      el.langSelect.addEventListener('change', (e) => {
        applyLanguage(e.target.value);
      });
    }

    if (el.langDropdownTrigger && el.langCustomDropdown && el.langDropdownMenu) {
      el.langDropdownTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        el.langCustomDropdown.classList.toggle('open');
      });

      el.langDropdownMenu.querySelectorAll('.custom-dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const selectedLang = item.getAttribute('data-lang');
          if (selectedLang) {
            applyLanguage(selectedLang);
          }
          el.langCustomDropdown.classList.remove('open');
        });
      });

      document.addEventListener('click', () => {
        el.langCustomDropdown.classList.remove('open');
      });
    }

    // GitHub external repository button
    if (el.githubBtn) {
      el.githubBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const url = el.githubBtn.getAttribute('href') || 'https://github.com/atukay/NeoText';
        if (window.chrome && window.chrome.webview) {
          try {
            window.chrome.webview.postMessage('open_url:' + url);
          } catch (err) {
            window.open(url, '_blank');
          }
        } else {
          window.open(url, '_blank');
        }
      });
    }

    // Buy Me a Coffee button
    if (el.coffeeBtn) {
      el.coffeeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const url = el.coffeeBtn.getAttribute('href') || 'https://buymeacoffee.com/atukay';
        if (window.chrome && window.chrome.webview) {
          try {
            window.chrome.webview.postMessage('open_url:' + url);
          } catch (err) {
            window.open(url, '_blank');
          }
        } else {
          window.open(url, '_blank');
        }
      });
    }

    // Microsoft Store Rate / Review button
    if (el.rateBtn) {
      el.rateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        try {
          localStorage.setItem('neotext_has_rated', 'true');
          updateRateButtonState();
        } catch (_) {}
        const storeUri = 'ms-windows-store://review/?ProductId=9PG680TWN0LC';
        const webUrl = el.rateBtn.getAttribute('href') || 'https://apps.microsoft.com/detail/9PG680TWN0LC';
        if (window.chrome && window.chrome.webview) {
          try {
            window.chrome.webview.postMessage('open_url:' + storeUri);
          } catch (err) {
            window.open(webUrl, '_blank');
          }
        } else {
          window.open(webUrl, '_blank');
        }
      });
    }

    // UI Scale controls
    if (el.uiScaleDecBtn) {
      el.uiScaleDecBtn.addEventListener('click', () => {
        const cur = state.uiScale || 100;
        const idx = UI_SCALES.indexOf(cur);
        if (idx > 0) applyUiScale(UI_SCALES[idx - 1]);
        else if (idx === -1) applyUiScale(100);
      });
    }
    if (el.uiScaleIncBtn) {
      el.uiScaleIncBtn.addEventListener('click', () => {
        const cur = state.uiScale || 100;
        const idx = UI_SCALES.indexOf(cur);
        if (idx !== -1 && idx < UI_SCALES.length - 1) applyUiScale(UI_SCALES[idx + 1]);
        else if (idx === -1) applyUiScale(100);
      });
    }

    // Font size controls
    el.fontDecBtn.addEventListener('click', () => applyFontSize(state.fontSize - 1));
    el.fontIncBtn.addEventListener('click', () => applyFontSize(state.fontSize + 1));

    // Save As, Print & Copy HTML
    if (el.saveAsBtn) {
      el.saveAsBtn.addEventListener('click', () => {
        el.dropdownMenu.classList.remove('show');
        const isTxt = isPlainTextDoc(state.fileName);
        const suggested = state.fileName || (isTxt ? 'Belge.txt' : 'Belge.md');
        if (window.chrome && window.chrome.webview) {
          window.chrome.webview.postMessage('save_as:' + suggested + '|' + content);
        }
      });
    }

    // Convert Document (MD <-> TXT)
    if (el.convertDocBtn) {
      el.convertDocBtn.addEventListener('click', () => {
        handleDocumentConversion();
      });
    }

    el.printBtn.addEventListener('click', () => {
      el.dropdownMenu.classList.remove('show');
      window.print();
    });

    function copyFallback(text) {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      } catch (e) {}
    }

    el.copyHtmlBtn.addEventListener('click', () => {
      el.dropdownMenu.classList.remove('show');
      const dict = I18N[state.lang || 'en'] || I18N.en;
      const html = el.markdownBody.innerHTML;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(html).then(() => {
          showToast(dict.copy_html_alert || 'Formatted HTML copied to clipboard!');
        }).catch(() => {
          copyFallback(html);
          showToast(dict.copy_html_alert || 'Formatted HTML copied to clipboard!');
        });
      } else {
        copyFallback(html);
        showToast(dict.copy_html_alert || 'Formatted HTML copied to clipboard!');
      }
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      // Ctrl + S : Save Document
      if (e.ctrlKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        if (state.isEditing) {
          // Inside edit mode: save directly without prompt
          saveDocument();
        } else {
          // Outside edit mode: prompt the user with confirmation dialog
          const dict = I18N[state.lang || 'en'] || I18N.en;
          const promptText = dict.save_confirm_prompt || 'Kayıt etmek istiyor musunuz?';
          const yesLabel = dict.btn_yes || 'Evet';
          const noLabel = dict.btn_no || 'Hayır';
          if (window.chrome && window.chrome.webview) {
            window.chrome.webview.postMessage('prompt_ctrl_s:' + promptText + '|' + yesLabel + '|' + noLabel + '|' + (state.fileName || ''));
          } else {
            if (confirm(promptText)) {
              saveDocument();
            }
          }
        }
        return;
      }

      // Ctrl + E : Toggle Edit Mode
      if (e.ctrlKey && (e.key === 'E' || e.key === 'e')) {
        e.preventDefault();
        toggleEditMode();
        return;
      }

      // Ctrl + 1 : Heading 1 (In Edit Mode)
      if (e.ctrlKey && e.key === '1') {
        if (state.isEditing) {
          e.preventDefault();
          if (state.isRawMode) insertRawPattern('h1');
          else formatVisual('h1');
          return;
        }
      }

      // Ctrl + 2 : Heading 2 (In Edit Mode)
      if (e.ctrlKey && e.key === '2') {
        if (state.isEditing) {
          e.preventDefault();
          if (state.isRawMode) insertRawPattern('h2');
          else formatVisual('h2');
          return;
        }
      }

      // Ctrl + I : Italic (In Edit Mode)
      if (e.ctrlKey && (e.key === 'I' || e.key === 'i')) {
        if (state.isEditing) {
          e.preventDefault();
          if (state.isRawMode) insertRawPattern('italic');
          else formatVisual('italic');
          return;
        }
      }

      // Ctrl + F : Open Search tab & focus search bar
      if (e.ctrlKey && (e.key === 'F' || e.key === 'f')) {
        e.preventDefault();
        openSearchTab();
        return;
      }
      // Alt + Shift + T : Toggle Theme
      if (e.altKey && e.shiftKey && (e.key === 'T' || e.key === 't')) {
        e.preventDefault();
        toggleTheme();
        return;
      }
      // Alt + Shift + B or Ctrl + B : Bold (if editing) or Toggle Sidebar
      if (e.ctrlKey && (e.key === 'B' || e.key === 'b')) {
        e.preventDefault();
        if (state.isEditing) {
          if (state.isRawMode) insertRawPattern('bold');
          else formatVisual('bold');
        } else {
          applySidebar(!state.sidebarOpen);
        }
        return;
      }
      // Ctrl + N / Ctrl + T : New Document Tab
      if (e.ctrlKey && (e.key === 'N' || e.key === 'n' || e.key === 'T' || e.key === 't')) {
        e.preventDefault();
        createNewTab();
        return;
      }

      // Ctrl + W : Close Current Document Tab
      if (e.ctrlKey && (e.key === 'W' || e.key === 'w')) {
        e.preventDefault();
        if (state.activeTabId) {
          closeTab(state.activeTabId);
        }
        return;
      }

      // Ctrl + Tab / Ctrl + Shift + Tab : Cycle Document Tabs
      if (e.ctrlKey && e.key === 'Tab') {
        e.preventDefault();
        if (state.tabs.length > 1) {
          const curIdx = state.tabs.findIndex(t => t.id === state.activeTabId);
          const step = e.shiftKey ? -1 : 1;
          const nextIdx = (curIdx + step + state.tabs.length) % state.tabs.length;
          switchTab(state.tabs[nextIdx].id);
        }
        return;
      }

      if (e.altKey && e.shiftKey && (e.key === 'B' || e.key === 'b')) {
        e.preventDefault();
        applySidebar(!state.sidebarOpen);
        return;
      }
    });
  }

  function copyTextToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    }
    return fallbackCopy(text);
  }

  function fallbackCopy(text) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      return Promise.resolve();
    } catch (e) {
      return Promise.resolve();
    }
  }

  // Global Code Copy Helper
  window.__neotext_copyCode = window.__neomd_copyCode = function(button) {
    const wrapper = button.closest('.code-block-wrapper');
    if (!wrapper) return;
    const codeElem = wrapper.querySelector('code');
    if (!codeElem) return;
    const code = codeElem.innerText;

    button._copyRequestId = (button._copyRequestId || 0) + 1;
    const reqId = button._copyRequestId;

    copyTextToClipboard(code).then(() => {
      if (button._copyRequestId !== reqId) return;

      const dict = I18N[state.lang || 'en'] || I18N.en;
      const span = button.querySelector('.copy-btn-text') || button.querySelector('span');
      const svg = button.querySelector('.copy-btn-icon') || button.querySelector('svg');

      if (button._copyTimeout) {
        clearTimeout(button._copyTimeout);
        button._copyTimeout = null;
      }

      button.classList.add('copied');
      if (span) span.textContent = dict.copied_text || 'Copied!';
      if (svg) {
        svg.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
      }
      button.style.borderColor = '#10b981';
      button.style.color = '#10b981';

      button._copyTimeout = setTimeout(() => {
        if (button._copyRequestId !== reqId) return;
        button.classList.remove('copied');
        const curDict = I18N[state.lang || 'en'] || I18N.en;
        if (span) span.textContent = curDict.copy_code_btn || 'Copy';
        if (svg) {
          svg.innerHTML = '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>';
        }
        button.style.borderColor = '';
        button.style.color = '';
        button._copyTimeout = null;
      }, 1800);
    });
  };

  // Utilities
  function slugify(text) {
    return text.toString().toLowerCase().trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  }

  function escapeHtml(text) {
    return String(text || '')
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function unescapeHtml(text) {
    return String(text || '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&nbsp;/g, ' ');
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function getWelcomeMarkdown() {
    if (state.lang === 'tr') {
      return `# NeoText - Hoş Geldiniz\n\nMarkdown dosyanız yükleniyor...\n`;
    }
    return `# Welcome to NeoText\n\nLoading document...\n`;
  }

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
