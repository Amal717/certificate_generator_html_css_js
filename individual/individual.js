let templateImage; // Store the selected template image globally
let logoImage; // Store the uploaded logo image globally
let selectedLogoName; // Store the name of the selected logo

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

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
    });
}

async function handleLogoUpload() {
    const logoUploadInput = document.getElementById('logo-upload');
    const file = logoUploadInput.files[0];

    if (file) {
        try {
            const originalLogoImg = await loadImage(URL.createObjectURL(file));

            // Resize the logo to a specific width (e.g., 100px)
            const resizedLogoImg = resizeImage(originalLogoImg, 100);

            logoImage = resizedLogoImg;
            selectedLogoName = file.name; // Store the name of the selected logo
            // Update UI with the selected logo name
            document.getElementById('selected-logo').textContent = `Selected Logo: ${selectedLogoName}`;
        } catch (error) {
            console.error('Error loading logo image:', error);
        }
    }
}

function resizeImage(originalImage, maxWidth) {
    const aspectRatio = originalImage.width / originalImage.height;
    const newWidth = Math.min(originalImage.width, maxWidth);
    const newHeight = newWidth / aspectRatio;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = newWidth;
    canvas.height = newHeight;

    context.drawImage(originalImage, 0, 0, newWidth, newHeight);

    const resizedImage = new Image();
    resizedImage.src = canvas.toDataURL('image/png');
    return resizedImage;
}

async function generateCertificate() {
    if (!templateImage) {
        console.error('No template selected');
        return;
    }

    // Retrieve form data
    const participantName = document.getElementById('participant-name').value;
    const institutionName = document.getElementById('institution-name').value;
    const eventName = document.getElementById('event-name').value;

    // Call function to handle logo upload (optional)
    await handleLogoUpload();

    // Create a new canvas element
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Set canvas size to the original size of the template image
    canvas.width = templateImage.naturalWidth;
    canvas.height = templateImage.naturalHeight;

    // Draw the template image on the canvas
    context.drawImage(templateImage, 0, 0, templateImage.naturalWidth, templateImage.naturalHeight);

    // Check if a logo is available
    if (logoImage) {
        // Define the x, y coordinates for placing the logo (adjust these values as needed)
        const logoX = 963;
        const logoY = 1168;

        // Draw the logo on the canvas
        context.drawImage(logoImage, logoX, logoY);
    }

    // Add text to the canvas at specific coordinates
    context.fillStyle = 'black'; // Set text color to black
    context.font = 'bold 50px Arial';

    // Define the x, y coordinates for placing text (adjust these values as needed)
    const participantNameX = 682;
    const participantNameY = 707;
    const institutionNameX = 368;
    const institutionNameY = 883;
    const eventNameX = 1012;
    const eventNameY = 984;

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


