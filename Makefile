.PHONY: setup-asdf
setup-asdf:
	asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git || true
	asdf install
