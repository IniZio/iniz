.PHONY: setup-asdf
setup-asdf:
	asdf plugin-add pnpm || true
	asdf plugin-add nodejs || true
	asdf install
