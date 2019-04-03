#!/bin/bash
set -e
cd $TRAVIS_BUILD_DIR

if [[ "$TRAVIS_BRANCH" == 'master' ]] && [[ "$TRAVIS_PULL_REQUEST" == 'false' ]]; then
	git config --global user.email 'maxpjh0528@naver.com'
	git config --global user.name 'MCPE_PC'
	git config --global credential.helper store
	echo "https://$GITHUB_TOKEN:x-oauth-basic@github.com" > ~/.git-credentials

	grunt jsdoc
	cd docs
	mv ../.git .
	git checkout -b gh-pages > /dev/null
	echo 'soundpad.js.org' > CNAME
	git add -A
	git commit -m "JSDoc Automation with Travis CI: build #$TRAVIS_BUILD_NUMBER" > /dev/null
	git push -u origin +gh-pages
	exit 0
fi

exit 1
