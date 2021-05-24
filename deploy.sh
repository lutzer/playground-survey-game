cd app; 
npm install; 
npm run build;
cd ..;
git add server/public/.
git commit -m 'deploy to heroku'
git subtree push --prefix server heroku master;
