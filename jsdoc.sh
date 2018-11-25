#!/bin/bash
if [[ "$TRAVIS_BRANCH" == 'master' ]] && [[ "$TRAVIS_PULL_REQUEST" == 'false' ]]; then
	git config --global user.name 'MCPE_PC'
	git config --global user.email 'maxpjh0528@naver.com'

	grunt jsdoc &&\
	echo "https://$GITHUB_TOKEN:x-oauth-basic@github.com" >> ~/.git-credentials &&\
	git add docs &&\
	git commit -m "Travis JSDoc automation: build $TRAVIS_BUILD_ID" &&\
	git push -u origin master &&\
	exit 0
fi

exit 1
