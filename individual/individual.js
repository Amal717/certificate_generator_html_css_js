function selectTemplate(templateNumber) {
    // Hide template options and show the form
    document.getElementById('template-options').style.display = 'none';
    document.getElementById('form-section').style.display = 'block';

    // Create a new image element for the selected template
    const selectedTemplateContainer = document.getElementById('selected-template-container');
    const selectedTemplateImg = document.createElement('img');
    selectedTemplateImg.src = `${templateNumber}.jpg`;
    selectedTemplateImg.alt = `Template ${templateNumber}`;
    selectedTemplateImg.style.width = '250px'; // Set a specific width for the selected template image
    selectedTemplateImg.style.height = 'auto'; // Maintain aspect ratio
    
    // Clear any existing content in the container and append the selected template image
    selectedTemplateContainer.innerHTML = '';
    selectedTemplateContainer.appendChild(selectedTemplateImg);
}

function generateCertificate() {
    // Retrieve form data
    const participantName = document.getElementById('participant-name').value;
    const institutionName = document.getElementById('institution-name').value;
    const eventName = document.getElementById('event-name').value;

    // Create a new PDF document
    const pdf = new jsPDF();

    // Set font size and style
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');

    // Add content to the PDF
    pdf.text(`Certificate for ${participantName}`, 20, 30);
    pdf.text(`Institution: ${institutionName}`, 20, 50);
    pdf.text(`Event: ${eventName}`, 20, 70);

    // Save the PDF with a specific name
    pdf.save('certificate.pdf');
}
