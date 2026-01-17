# Frontend React - Gestion des Anomalies et Maintenance

Interface React.js moderne avec Bootstrap pour interagir avec les microservices.

## 🚀 Installation

```bash
cd react-frontend
npm install
```

## 📋 Demarrage

```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 🛠️ Technologies

- **React 18** - Bibliothèque UI
- **React Bootstrap** - Composants Bootstrap pour React
- **Axios** - Client HTTP pour les appels API
- **Bootstrap 5** - Framework CSS

## 📱 Fonctionnalites

- ✅ Gestion complète des alertes avec filtres
- ✅ Gestion des mesures d'analyse
- ✅ Gestion des techniciens avec filtres multiples
- ✅ Gestion des interventions
- ✅ Dashboard avec statistiques
- ✅ CRUD complet (Create, Read, Update, Delete)
- ✅ Filtres en temps reel
- ✅ Design responsive avec Bootstrap

## 🔧 Configuration

Si vos services tournent sur d'autres ports, modifiez `src/services/api.js` :

```javascript
const API_CONFIG = {
  SURVEILLANCE: 'http://localhost:8080',
  MAINTENANCE: 'http://localhost:8081'
};
```

## 📦 Build pour production

```bash
npm run build
```

Les fichiers optimises seront dans le dossier `build/`.
