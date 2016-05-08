server-local:
	echo "Exporting env vars for app to session might be a bad call. Dev only."
	source "./bin/env-vars.sh"
	node .
