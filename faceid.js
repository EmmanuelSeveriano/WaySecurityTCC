// Elementos do DOM
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const initCameraBtn = document.getElementById('init-camera');
const capturePhotoBtn = document.getElementById('capture-photo');
const status = document.getElementById('status');
const capturedPhoto = document.getElementById('captured-photo');
const analysisResults = document.getElementById('analysis-results');
const photoDisplay = document.getElementById('photo-display');
const analysisContent = document.getElementById('analysis-content');
const recognitionTime = document.getElementById('recognition-time');
const timeDisplay = document.getElementById('time-display');
const cameraPlaceholder = document.getElementById('camera-placeholder');

// Variáveis de estado
let stream = null;
let isCameraInitialized = false;

// Inicializar câmera
async function initCamera() {
    try {
        showStatus('Inicializando câmera...', 'info');
        
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: 'user'
            }
        });
        
        video.srcObject = stream;
        isCameraInitialized = true;
        
        // Ocultar placeholder e mostrar vídeo
        cameraPlaceholder.style.display = 'none';
        video.style.display = 'block';
        
        // Habilitar botão de captura
        capturePhotoBtn.disabled = false;
        
        showStatus('Câmera inicializada com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao acessar câmera:', error);
        showStatus('Erro ao acessar câmera. Verifique as permissões.', 'error');
        updateDetectionStatus('Erro ao acessar câmera', 'not-detected');
    }
}

// Capturar foto e analisar
async function captureAndAnalyze() {
    if (!isCameraInitialized) {
        showStatus('Câmera não foi inicializada!', 'error');
        return;
    }
    
    try {
        showStatus('Capturando e analisando...', 'info');
        
        // Capturar frame do vídeo
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        // Converter para blob e exibir
        canvas.toBlob(async (blob) => {
            const imageUrl = URL.createObjectURL(blob);
            photoDisplay.src = imageUrl;
            capturedPhoto.style.display = 'block';
            
            // Analisar a imagem
            await analyzeImage(blob);
            
            // Mostrar horário do reconhecimento
            showRecognitionTime();
            
            showStatus('Análise concluída com sucesso!', 'success');
        }, 'image/jpeg', 0.9);
        
    } catch (error) {
        console.error('Erro ao capturar foto:', error);
        showStatus('Erro ao capturar foto.', 'error');
    }
}

// Analisar imagem usando detecção facial
async function analyzeImage(imageBlob) {
    try {
        // Simular análise facial (em um sistema real, você usaria uma API como Face-API.js)
        const analysisResult = await simulateFacialAnalysis(imageBlob);
        
        // Exibir resultados
        displayAnalysisResults(analysisResult);
        analysisResults.style.display = 'block';
        
    } catch (error) {
        console.error('Erro na análise:', error);
        showStatus('Erro na análise da imagem.', 'error');
    }
}

// Simular análise facial (substitua por uma API real)
async function simulateFacialAnalysis(imageBlob) {
    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simular resultados de detecção
    const confidence = Math.floor(Math.random() * 30) + 70; // 70-100%
    const hasFace = Math.random() > 0.1; // 90% de chance de detectar rosto
    
    if (hasFace) {
        return {
            faceDetected: true,
            confidence: confidence,
            features: {
                eyes: 'Detectados',
                nose: 'Detectado',
                mouth: 'Detectado',
                faceShape: 'Oval'
            },
            landmarks: Math.floor(Math.random() * 20) + 60 + ' pontos detectados',
            quality: confidence > 85 ? 'Excelente' : confidence > 75 ? 'Boa' : 'Regular'
        };
    } else {
        return {
            faceDetected: false,
            confidence: 0,
            error: 'Nenhum rosto detectado na imagem'
        };
    }
}

// Exibir resultados da análise
function displayAnalysisResults(results) {
    if (results.faceDetected) {
        analysisContent.innerHTML = `
            <div class="analysis-grid">
                <div class="analysis-item">
                    <strong>Rosto Detectado:</strong> Sim
                </div>
                <div class="analysis-item">
                    <strong>Confiança:</strong> ${results.confidence}%
                </div>
                <div class="analysis-item">
                    <strong>Qualidade:</strong> ${results.quality}
                </div>
                <div class="analysis-item">
                    <strong>Pontos de Referência:</strong> ${results.landmarks}
                </div>
            </div>
            
            <h4>Características Detectadas:</h4>
            <div class="features-list">
                <ul>
                    <li>👁️ Olhos: ${results.features.eyes}</li>
                    <li>👃 Nariz: ${results.features.nose}</li>
                    <li>👄 Boca: ${results.features.mouth}</li>
                    <li>🫂 Formato do Rosto: ${results.features.faceShape}</li>
                </ul>
            </div>
        `;
        
        // Status de sucesso
        showStatus('Rosto detectado com sucesso!', 'success');
    } else {
        analysisContent.innerHTML = `
            <div class="analysis-item error">
                <strong>Erro:</strong> ${results.error}
            </div>
            <p>Tente posicionar seu rosto melhor na câmera e capture novamente.</p>
        `;
        
        // Status de erro
        showStatus('Nenhum rosto detectado', 'error');
    }
}

// Mostrar horário do reconhecimento
function showRecognitionTime() {
    const now = new Date();
    const timeString = now.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    timeDisplay.textContent = timeString;
    recognitionTime.style.display = 'block';
}



// Mostrar mensagens de status
function showStatus(message, type) {
    status.textContent = message;
    status.className = `status ${type}`;
    
    // Limpar status após 5 segundos
    setTimeout(() => {
        status.textContent = '';
        status.className = 'status';
    }, 5000);
}

// Event Listeners
initCameraBtn.addEventListener('click', initCamera);
capturePhotoBtn.addEventListener('click', captureAndAnalyze);

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    showStatus('Sistema de reconhecimento facial carregado. Clique em "Inicializar Câmera" para começar.', 'info');
});
