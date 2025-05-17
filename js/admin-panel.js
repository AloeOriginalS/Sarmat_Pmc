import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    query, 
    orderBy, 
    onSnapshot, 
    doc, 
    getDoc, 
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
import { auth, db } from './firebase-config.js';

// Конфигурация статусов
const STATUS_CONFIG = {
    approved: { class: 'status-approved', text: 'ОДОБРЕНО' },
    pending: { class: 'status-pending', text: 'НА РАССМОТРЕНИИ' },
    rejected: { class: 'status-rejected', text: 'ОТКЛОНЕНО' }
};

// Проверка прав администратора
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        redirectToLogin();
        return;
    }

    try {
        const adminDoc = await getDoc(doc(db, "admins", user.uid));
        if (!adminDoc.exists()) {
            await handleUnauthorizedAccess();
        } else {
            initAdminPanel();
        }
    } catch (error) {
        console.error("Ошибка проверки прав:", error);
        showError("Ошибка доступа к системе");
    }
});

const redirectToLogin = () => {
    window.location.href = "profile.html";
};

const handleUnauthorizedAccess = async () => {
    alert("Доступ разрешен только администраторам");
    await signOut(auth);
    redirectToLogin();
};

const initAdminPanel = () => {
    loadApplications();
    setupRealTimeUpdates();
};

// Загрузка заявок с обработкой ошибок
const loadApplications = () => {
    const list = document.getElementById('applicationsList');
    if (!list) {
        console.error("Элемент applicationsList не найден");
        return;
    }
    
    list.innerHTML = '<div class="loading">Загрузка данных...</div>';

    const q = query(collection(db, "applications"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, 
        (snapshot) => {
            if (!snapshot) {
                list.innerHTML = '<div class="error-state">Ошибка загрузки данных</div>';
                return;
            }
            
            list.innerHTML = '';
            if (snapshot.empty) {
                list.innerHTML = '<div class="empty-state">Нет новых заявок</div>';
                return;
            }

            snapshot.forEach(doc => {
                if (!doc.exists()) return;
                try {
                    renderApplicationCard(doc);
                } catch (error) {
                    console.error("Ошибка рендеринга карточки:", error);
                }
            });
        },
        (error) => {
            console.error("Ошибка загрузки:", error);
            list.innerHTML = '<div class="error-state">Ошибка загрузки данных</div>';
        }
    );
};

// Рендер карточки заявки
const renderApplicationCard = (doc) => {
    try {
        const app = doc.data();
        if (!app) {
            console.error("Нет данных в документе");
            return;
        }
        
        const status = app.status || 'pending';
        const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
        const formattedDate = app.createdAt?.toDate()?.toLocaleDateString('ru-RU') || 'Дата не указана';

        const card = document.createElement('div');
        card.className = `application-card ${statusConfig.class}`;
        card.innerHTML = `
            <div class="status-tag ${statusConfig.class}">${statusConfig.text}</div>
            <h3>${app.callsign || 'Без позывного'}</h3>
            
            <div class="application-info">
                <div class="info-row">
                    <span class="label">Email:</span>
                    <span class="value">${app.email || 'Не указан'}</span>
                </div>
                <div class="info-row">
                    <span class="label">Discord:</span>
                    <span class="value">${app.discordNickname || 'Не указан'}</span>
                </div>
                <div class="info-row">
                    <span class="label">Возраст:</span>
                    <span class="value">${app.age || 'Не указан'}</span>
                </div>
                <div class="info-row">
                    <span class="label">Дата подачи:</span>
                    <span class="value">${formattedDate}</span>
                </div>
            </div>

            <div class="motivation-section">
                <h4>Мотивация:</h4>
                <p>${app.motivation || 'Не указана'}</p>
            </div>

            <div class="application-actions">
                <button class="approve-btn" data-id="${doc.id}">✅ Одобрить</button>
                <button class="reject-btn" data-id="${doc.id}">❌ Отклонить</button>
            </div>
        `;

        const list = document.getElementById('applicationsList');
        if (list) {
            list.appendChild(card);
        }
    } catch (error) {
        console.error("Ошибка при рендеринге карточки:", error);
    }
};

// Обработчики действий
const setupRealTimeUpdates = () => {
    document.addEventListener('click', async (e) => {
        try {
            const target = e.target;
            if (!target.closest('.approve-btn, .reject-btn')) return;

            const id = target.dataset.id;
            if (!id) {
                console.error("ID документа не найден");
                return;
            }

            const action = target.classList.contains('approve-btn') ? 'approved' : 'rejected';
            
            try {
                await updateApplicationStatus(id, action);
                showSuccess(`Заявка успешно ${action === 'approved' ? 'одобрена' : 'отклонена'}`);
            } catch (error) {
                console.error("Ошибка обновления статуса:", error);
                showError(`Ошибка: ${error.message}`);
            }
        } catch (error) {
            console.error("Ошибка в обработчике клика:", error);
        }
    });
};

const updateApplicationStatus = async (id, status) => {
    try {
        await updateDoc(doc(db, "applications", id), {
            status: status,
            reviewedAt: serverTimestamp()
        });
        
        // Если заявка одобрена, создаем учетную запись пользователя
        if (status === 'approved') {
            const appDoc = await getDoc(doc(db, "applications", id));
            if (appDoc.exists()) {
                const appData = appDoc.data();
                // Здесь можно добавить логику создания пользователя
                // и отправки email с данными для входа
            }
        }
    } catch (error) {
        console.error("Ошибка обновления документа:", error);
        throw error;
    }
};

// Вспомогательные функции
const showError = (message) => {
    const alert = document.createElement('div');
    alert.className = 'alert error';
    alert.textContent = message;
    document.body.prepend(alert);
    setTimeout(() => alert.remove(), 5000);
};

const showSuccess = (message) => {
    const alert = document.createElement('div');
    alert.className = 'alert success';
    alert.textContent = message;
    document.body.prepend(alert);
    setTimeout(() => alert.remove(), 5000);
};