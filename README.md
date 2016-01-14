Build
=====

```
git clone https://github.com/Wyliodrin/wyliodrin-shell.git
cd wyliodrin-shell
npm install
npm install grunt-cli
./node_modules/grunt-cli/bin/grunt build
rm -rf gruntfile.js package.json public/ server/
mv tmp/* .
rm -rf tmp/
```

Run
===
```
node main.js
```

Connect
=======
```
http://<ip>:9000/public/index.html?password=<md5_of_password>
```
