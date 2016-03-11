.PHONY: build
build:
	npm install
	npm install grunt-cli
	./node_modules/grunt-cli/bin/grunt build

.PHONY: install
install:
	mkdir -p $(DESTDIR)/usr/wyliodrin/wyliodrin-shell
	cp -rf node_modules tmp/* $(DESTDIR)/usr/wyliodrin/wyliodrin-shell
	mkdir -p $(DESTDIR)/etc/supervisor/conf.d
	cp -rf wyliodrin-shell.conf $(DESTDIR)/etc/supervisor/conf.d

.PHONY: clean
clean:
	rm -rf node_modules
