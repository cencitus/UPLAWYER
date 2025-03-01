from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from docx import Document
from docx.shared import Pt, RGBColor
import traceback
import os
from docx2pdf import convert

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:5500"}})

DEFAULT_FONT_NAME = "Times New Roman"
DEFAULT_FONT_SIZE = 12  # Размер шрифта
DEFAULT_FONT_COLOR = RGBColor(0, 0, 0)  # Чёрный цвет текста


def apply_styles_to_paragraph(paragraph):
    """
    Применяет единый стиль ко всем абзацам: шрифт, размер, цвет.
    """
    for run in paragraph.runs:
        font = run.font
        font.name = DEFAULT_FONT_NAME
        font.size = Pt(DEFAULT_FONT_SIZE)
        font.color.rgb = DEFAULT_FONT_COLOR

@app.route('/generated/<name_of_doc>', methods=['POST'])
def generate_docx_document(name_of_doc):
    try:
        # Получаем данные из запроса
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Указываем путь к шаблону
        template_path = os.path.join('templates', name_of_doc)
        if not os.path.exists(template_path):
            return jsonify({"error": f"Template file not found: {template_path}"}), 404

        # Загружаем шаблон
        doc = Document(template_path)

        # Заменяем плейсхолдеры в тексте
        for paragraph in doc.paragraphs:
            for key, value in data.items():
                placeholder = f'{{{{ {key} }}}}'
                if placeholder in paragraph.text:
                    paragraph.text = paragraph.text.replace(placeholder, value)
                    apply_styles_to_paragraph(paragraph)

        # Сохраняем изменённый документ
        output_path = 'generated_document.docx'
        doc.save(output_path)

        # Отправляем сгенерированный документ клиенту
        return send_file(output_path, as_attachment=True, download_name='generated_document.docx')

    except Exception as e:
        # Логируем ошибку в консоль
        app.logger.error(f"Ошибка: {e}")
        app.logger.error(traceback.format_exc())
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True,port=5500, threaded=False)