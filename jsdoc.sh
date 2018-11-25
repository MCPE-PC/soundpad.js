#!/bin/bash
if [[ "$TRAVIS_BRANCH" == 'master' ]] && [[ "$TRAVIS_PULL_REQUEST" == 'false' ]]; then
	git config --global user.name 'MCPE_PC'
	git config --global user.email 'maxpjh0528@naver.com'

	grunt jsdoc &&\
	curl -H "Authorization: token $GITHUB_TOKEN" https://github.com/MCPE-PC/soundpad.js.git > /dev/null &&\
	git add docs &&\
	git commit -m "Travis JSDoc automation: build $TRAVIS_BUILD_ID" &&\
	git push -u origin master &&\
	exit 0
fi

exit 1
