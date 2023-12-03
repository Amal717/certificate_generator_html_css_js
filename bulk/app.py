from flask import Flask, render_template, request, jsonify, send_from_directory, redirect, url_for
import base64
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
import zipfile
import os
import shutil

app = Flask(__name__, template_folder='.')


UPLOAD_FOLDER = 'uploads'
DOWNLOAD_FOLDER = 'downloads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['DOWNLOAD_FOLDER'] = DOWNLOAD_FOLDER

@app.route('/')
def index():
    return render_template('bulk.html')

@app.route('/process_image', methods=['POST'])
def process_image():
    data = request.get_json()

    participant_name = data['participantName']
    institution_name = data['institutionName']
    event_name = data['eventName']
    template_src = data['templateSrc']

    # Process the image on the backend
    processed_image = process_image_on_backend(participant_name, institution_name, event_name, template_src)

    # Save processed image to disk
    output_filename = f"{participant_name}_Certificate.png"
    output_filepath = os.path.join(app.config['UPLOAD_FOLDER'], output_filename)
    processed_image.save(output_filepath)

    return jsonify({'outputFilename': output_filename})

def process_image_on_backend(participant_name, institution_name, event_name, template_src):
    # This is a placeholder. Implement your image processing logic here.
    # You may want to use a library like PIL (Pillow) for image manipulation.
    # For simplicity, this example just decodes the base64 image data.
    template_image_data = template_src.split(',')[1]
    template_image = Image.open(BytesIO(base64.b64decode(template_image_data)))

    # Create a new image based on the template
    processed_image = template_image.copy()

    # Add text to the image
    draw = ImageDraw.Draw(processed_image)
    font = ImageFont.load_default()  # You may want to use a custom font
    text_position_participant = (50, 50)  # Adjust the position as needed for participant name
    text_position_institution = (50, 100)  # Adjust the position as needed for institution name
    text_position_event = (50, 150)  # Adjust the position as needed for event name

    # Add participant name
    draw.text(text_position_participant, participant_name, fill='black', font=font)

    # Add institution name
    draw.text(text_position_institution, institution_name, fill='black', font=font)

    # Add event name
    draw.text(text_position_event, event_name, fill='black', font=font)

    return processed_image

@app.route('/download_zip')
def download_zip():
    # Create a zip file with all processed images
    zip_filepath = os.path.join(app.config['DOWNLOAD_FOLDER'], 'Certificates.zip')
    with zipfile.ZipFile(zip_filepath, 'w') as zipf:
        for filename in os.listdir(app.config['UPLOAD_FOLDER']):
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            zipf.write(filepath, os.path.basename(filepath))

    # Remove uploaded files
    shutil.rmtree(app.config['UPLOAD_FOLDER'])
    os.makedirs(app.config['UPLOAD_FOLDER'])

    # Redirect to the download page
    return redirect(url_for('download_page'))

@app.route('/download_page')
def download_page():
    return render_template('download.html')

if __name__ == '__main__':
    # Ensure the UPLOAD and DOWNLOAD folders exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['DOWNLOAD_FOLDER'], exist_ok=True)

    app.run(debug=True)
from flask import Flask, render_template, request, jsonify, send_from_directory, redirect, url_for
import base64
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
import zipfile
import os
import shutil

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
DOWNLOAD_FOLDER = 'downloads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['DOWNLOAD_FOLDER'] = DOWNLOAD_FOLDER

@app.route('/')
def index():
    return render_template('bulk.html')

@app.route('/process_image', methods=['POST'])
def process_image():
    data = request.get_json()

    participant_name = data['participantName']
    institution_name = data['institutionName']
    event_name = data['eventName']
    template_src = data['templateSrc']

    # Process the image on the backend
    processed_image = process_image_on_backend(participant_name, institution_name, event_name, template_src)

    # Save processed image to disk
    output_filename = f"{participant_name}_Certificate.png"
    output_filepath = os.path.join(app.config['UPLOAD_FOLDER'], output_filename)
    processed_image.save(output_filepath)

    return jsonify({'outputFilename': output_filename})

def process_image_on_backend(participant_name, institution_name, event_name, template_src):
    # This is a placeholder. Implement your image processing logic here.
    # You may want to use a library like PIL (Pillow) for image manipulation.
    # For simplicity, this example just decodes the base64 image data.
    template_image_data = template_src.split(',')[1]
    template_image = Image.open(BytesIO(base64.b64decode(template_image_data)))

    # Create a new image based on the template
    processed_image = template_image.copy()

    # Add text to the image
    draw = ImageDraw.Draw(processed_image)
    font = ImageFont.load_default()  # You may want to use a custom font
    text_position_participant = (50, 50)  # Adjust the position as needed for participant name
    text_position_institution = (50, 100)  # Adjust the position as needed for institution name
    text_position_event = (50, 150)  # Adjust the position as needed for event name

    # Add participant name
    draw.text(text_position_participant, participant_name, fill='black', font=font)

    # Add institution name
    draw.text(text_position_institution, institution_name, fill='black', font=font)

    # Add event name
    draw.text(text_position_event, event_name, fill='black', font=font)

    return processed_image

@app.route('/download_zip')
def download_zip():
    # Create a zip file with all processed images
    zip_filepath = os.path.join(app.config['DOWNLOAD_FOLDER'], 'Certificates.zip')
    with zipfile.ZipFile(zip_filepath, 'w') as zipf:
        for filename in os.listdir(app.config['UPLOAD_FOLDER']):
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            zipf.write(filepath, os.path.basename(filepath))

    # Remove uploaded files
    shutil.rmtree(app.config['UPLOAD_FOLDER'])
    os.makedirs(app.config['UPLOAD_FOLDER'])

    # Redirect to the download page
    return redirect(url_for('download_page'))

@app.route('/download_page')
def download_page():
    return render_template('download.html')

if __name__ == '__main__':
    # Ensure the UPLOAD and DOWNLOAD folders exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['DOWNLOAD_FOLDER'], exist_ok=True)

    app.run(debug=True)
