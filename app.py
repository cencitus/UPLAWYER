from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask import Flask, request, send_file, jsonify, send_from_directory
from flask_cors import CORS
from docx import Document
from docx.shared import Pt, RGBColor
import traceback
import os
from datetime import datetime
from docx2pdf import convert

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:sava2316@localhost/uplawyer_bd'
app.config['SECRET_KEY'] = 'your-secret-key-here'
db = SQLAlchemy(app)
login_manager = LoginManager(app)
CORS(app, 
    resources={r"/*": {"origins": "http://127.0.0.1:5500"}},
    supports_credentials=True  # Разрешаем передачу кук
)

DEFAULT_FONT_NAME = "Times New Roman"
DEFAULT_FONT_SIZE = 12
DEFAULT_FONT_COLOR = RGBColor(0, 0, 0)

# Модели
class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True)
    email = db.Column(db.String(100), unique=True)
    password_hash = db.Column(db.String(512))
    documents = db.relationship('DocumentHistory', backref='user', lazy=True)

class DocumentHistory(db.Model):
   __tablename__ = 'document_history'  # Явно указываем имя таблицы
   id = db.Column(db.Integer, primary_key=True)
   user_id = db.Column(db.Integer, db.ForeignKey('users.id'))  # Ссылаемся на таблицу users
   template_name = db.Column(db.String(100))
   generated_at = db.Column(db.DateTime, default=datetime.utcnow)
   download_link = db.Column(db.String(255))

def apply_styles_to_paragraph(paragraph):
    for run in paragraph.runs:
        font = run.font
        font.name = DEFAULT_FONT_NAME
        font.size = Pt(DEFAULT_FONT_SIZE)
        font.color.rgb = DEFAULT_FONT_COLOR

@app.route("/")
def home():
    return send_from_directory("static", "create_document.html")

@app.route("/<path:filename>")
def static_files(filename):
    return send_from_directory("static", filename)

# Новый обработчик для POST запросов без имени файла в URL
@app.route('/generate_d', methods=['POST'])
def generate_docx_document():
    try:
        data = request.json
        name_of_doc = data.get('filename')
        if not name_of_doc:
            return jsonify({"error": "Filename not provided"}), 400

        # Удаляем параметры из данных, чтобы не пытаться их подставить
        form_data = {k: v for k, v in data.items() if k != 'filename'}

        template_path = os.path.join('templates', name_of_doc)
        if not os.path.exists(template_path):
            return jsonify({"error": f"Template file not found: {template_path}"}), 404

        doc = Document(template_path)

        for paragraph in doc.paragraphs:
            for key, value in form_data.items():
                placeholder = f'{{{{ {key} }}}}'
                if placeholder in paragraph.text:
                    paragraph.text = paragraph.text.replace(placeholder, value)
                    apply_styles_to_paragraph(paragraph)

        output_path = 'generated_document.docx'
        doc.save(output_path)

        return send_file(output_path, as_attachment=True, download_name='generated_document.docx')

    except Exception as e:
        app.logger.error(f"Ошибка: {e}")
        app.logger.error(traceback.format_exc())
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

# Старый обработчик (оставлен для совместимости)
@app.route('/generate_d/<name_of_doc>', methods=['POST'])
def generate_docx_document_with_path(name_of_doc):
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400

        template_path = os.path.join('templates', name_of_doc)
        if not os.path.exists(template_path):
            return jsonify({"error": f"Template file not found: {template_path}"}), 404

        doc = Document(template_path)

        for paragraph in doc.paragraphs:
            for key, value in data.items():
                placeholder = f'{{{{ {key} }}}}'
                if placeholder in paragraph.text:
                    paragraph.text = paragraph.text.replace(placeholder, value)
                    apply_styles_to_paragraph(paragraph)

        output_path = 'generated_document.docx'
        doc.save(output_path)

        return send_file(output_path, as_attachment=True, download_name='generated_document.docx')

    except Exception as e:
        app.logger.error(f"Ошибка: {e}")
        app.logger.error(traceback.format_exc())
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

@app.route('/generate_p/<name_of_doc>', methods=['POST'])
def generate_pdf_document(name_of_doc):
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400

        template_path = os.path.join('templates', name_of_doc)
        if not os.path.exists(template_path):
            return jsonify({"error": f"Template file not found: {template_path}"}), 404

        doc = Document(template_path)

        for paragraph in doc.paragraphs:
            for key, value in data.items():
                placeholder = f'{{{{ {key} }}}}'
                if placeholder in paragraph.text:
                    paragraph.text = paragraph.text.replace(placeholder, value)
                    apply_styles_to_paragraph(paragraph)

        temp_docx_path = 'temp_document.docx'
        doc.save(temp_docx_path)

        output_pdf_path = 'generated_document.pdf'
        convert("temp_document.docx", "generated_document.pdf")
        return send_file(output_pdf_path, as_attachment=True, download_name='generated_document.pdf')

    except Exception as e:
        app.logger.error(f"Ошибка: {e}")
        app.logger.error(traceback.format_exc())
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Регистрация
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    hashed_password = generate_password_hash(data['password'])
    new_user = User(username=data['username'], email=data['email'], password_hash=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created"}), 201

# Вход
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    
    if user and check_password_hash(user.password_hash, data['password']):
        login_user(user, remember=True)  # Добавляем remember=True
        return jsonify({
            "message": "Logged in successfully",
            "user": user.username,
            "id": user.id
        }), 200
    return jsonify({"error": "Invalid credentials"}), 401

# Выход
@app.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out"}), 200

# История документов
@app.route('/history')
@login_required
def get_history():
    history = DocumentHistory.query.filter_by(user_id=current_user.id).all()
    return jsonify([{
        'template_name': item.template_name,
        'generated_at': item.generated_at
    } for item in history])




if __name__ == '__main__':
    app.run(debug=True, port=5500, threaded=False)