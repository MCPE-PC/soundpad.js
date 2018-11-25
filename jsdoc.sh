#!/bin/bash
if [[ "$TRAVIS_BRANCH" == 'master' ]] && [[ "$TRAVIS_PULL_REQUEST" == 'false' ]]; then
	git config --global user.name 'MCPE_PC'
	git config --global user.email 'maxpjh0528@naver.com'

	grunt jsdoc &&\
	git remote add github "https://$GITHUB_TOKEN@github.com/MCPE-PC/soundpad.js.git" &&\
	git add docs &&\
	git commit -m "" &&\
	git push -u github master &&\
	exit 0
fi

exit 1
