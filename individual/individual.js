let templateImage; // Store the selected template image globally

function selectTemplate(templateNumber) {
    // Create a new image element for the selected template
    const selectedTemplateImg = new Image();
    selectedTemplateImg.src = `${templateNumber}.jpg`;
    selectedTemplateImg.alt = `Template ${templateNumber}`;
    selectedTemplateImg.style.width = '250px'; // Set a specific width for the selected template image
    selectedTemplateImg.style.height = 'auto'; // Maintain aspect ratio

    // Clear any existing content in the container and append the selected template image
    const selectedTemplateContainer = document.getElementById('selected-template-container');
    selectedTemplateContainer.innerHTML = '';
    selectedTemplateContainer.appendChild(selectedTemplateImg);

    // Store the selected template image globally
    templateImage = selectedTemplateImg;
}

function generateCertificate() {
    if (!templateImage) {
        console.error('No template selected');
        return;
    }

    // Retrieve form data
    const participantName = document.getElementById('participant-name').value;
    const institutionName = document.getElementById('institution-name').value;
    const eventName = document.getElementById('event-name').value;

    // Define the x, y coordinates for placing text (replace these values with your actual coordinates)
    const participantNameX = 682;
    const participantNameY = 707;
    const institutionNameX = 295;
    const institutionNameY = 883;
    const eventNameX = 953;
    const eventNameY = 984;

    // Create a new canvas element
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Set canvas size to the original size of the template image
    canvas.width = templateImage.naturalWidth;
    canvas.height = templateImage.naturalHeight;
    

    // Draw the template image on the canvas
    context.drawImage(templateImage, 0, 0, templateImage.naturalWidth, templateImage.naturalHeight);

    // Add text to the canvas at specific coordinates
    context.fillStyle = 'black'; // Set text color to black
    context.font = 'bold 50px Arial';

    // Add participant name
    context.fillText(participantName, participantNameX, participantNameY);

    // Add institution name
    context.fillText(institutionName, institutionNameX, institutionNameY);

    // Add event name
    context.fillText(eventName, eventNameX, eventNameY);

    // Show the generated certificate in a new window
    const newWindow = window.open();
    newWindow.document.body.appendChild(canvas);
}
