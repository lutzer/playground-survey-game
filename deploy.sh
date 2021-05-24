cd app; 
npm install; 
npm run build;
cd ..;
git add .
git commit -m 'deploy'
git subtree push --prefix server heroku master;
