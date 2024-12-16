# Nom des services Docker Compose
COMPOSE=docker compose                   # Commande pour exécuter Docker Compose
NEXTJS_SERVICE=nextjs                    # Service Docker pour Next.js

# Commandes Docker Compose
build:                                   # Construire l'image Docker pour Next.js
	$(COMPOSE) build $(NEXTJS_SERVICE)

start:                                   # Démarrer le conteneur Next.js
	$(COMPOSE) start $(NEXTJS_SERVICE)

stop:                                    # Arrêter le conteneur Next.js
	$(COMPOSE) stop $(NEXTJS_SERVICE)

up:                                      # Démarrer le conteneur Next.js en arrière-plan
	$(COMPOSE) up -d $(NEXTJS_SERVICE)

down:                                    # Arrêter et supprimer le conteneur Next.js
	$(COMPOSE) down

restart:                                 # Redémarrer le conteneur Next.js
	$(COMPOSE) stop $(NEXTJS_SERVICE) && $(COMPOSE) start $(NEXTJS_SERVICE)

docker-ps:                               # Afficher l'état du conteneur Next.js
	$(COMPOSE) ps $(NEXTJS_SERVICE)

logs:                                    # Afficher les logs du conteneur Next.js en temps réel
	$(COMPOSE) logs -f $(NEXTJS_SERVICE)

# Accès au conteneur
nextjs-bash:                             # Ouvrir un terminal dans le conteneur Next.js
	$(COMPOSE) exec -it $(NEXTJS_SERVICE) bash

# Commandes spécifiques à Next.js
install:                                 # Installer les dépendances avec npm
	$(COMPOSE) exec $(NEXTJS_SERVICE) npm install

update:                                  # Mettre à jour les dépendances npm
	$(COMPOSE) exec $(NEXTJS_SERVICE) npm update

dev:                                     # Démarrer le serveur de développement
	$(COMPOSE) exec $(NEXTJS_SERVICE) npm run dev

build-next:                              # Générer une version de production du projet
	$(COMPOSE) exec $(NEXTJS_SERVICE) npm run build

start-next:                              # Démarrer le serveur en mode production
	$(COMPOSE) exec $(NEXTJS_SERVICE) npm start

lint:                                    # Vérifier le code avec ESLint
	$(COMPOSE) exec $(NEXTJS_SERVICE) npm run lint

test:                                    # Lancer les tests unitaires
	$(COMPOSE) exec $(NEXTJS_SERVICE) npm run test

test-watch:                              # Lancer les tests en mode "watch"
	$(COMPOSE) exec $(NEXTJS_SERVICE) npm run test:watch

format:                                  # Formater le code avec Prettier
	$(COMPOSE) exec $(NEXTJS_SERVICE) npm run format