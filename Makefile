.PHONY: build
build:
	npm install
	npm install grunt-cli
	./node_modules/grunt-cli/bin/grunt build

.PHONY: install
install:
  mkdir -p $(DESTDIR)/usr/wyliodrin/wyliodrin-shell
  cp -rf node_modules tmp/* $(DESTDIR)/usr/wyliodrin/wyliodrin-shell

.PHONY: clean
clean:
  rm -rf node_modules
