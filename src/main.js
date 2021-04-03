'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const fetch = require('node-fetch');
const { join, dirname } = require('path');
const { generate_files } = require('./new_post');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const data = yaml.load(fs.readFileSync(join(dirname(__dirname) + '/_config.yml'), 'utf-8'));

function main(page = 1) {
    fetch(`https://api.github.com/repos/${data.repo}/issues?page=${page}&per_page=100`, {
        method: 'GET',
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
        },
    })
        .then((response) => {
            if (response.headers.get('Link') && /rel\=\"next\"/gi.test(response.headers.get('Link'))) {
                main(page + 1);
            }
            return response.json();
        })
        .then((list) => {
            list.forEach((post) => {
                let title = post.title,
                    date = post.created_at.replace(/[TZ]/g, ' '),
                    updated = post.updated_at.replace(/[TZ]/g, ' '),
                    categories = post.milestone;
                let tags = [];
                post.labels.forEach((tag) => {
                    tags.push(tag.name);
                });

                if (!fs.existsSync(join(dirname(__dirname) + `/dist/_posts/${post.number}.md`))) {
                    generate_files(post.number);
                }
                let content = fs.readFileSync(join(dirname(__dirname) + `/dist/_posts/${post.number}.md`), 'utf-8');
                (title && (content = content.replace('<!-- titlePlaceHolder -->', `title: ${title}`))) || (content = content.replace('<!-- titlePlaceHolder -->', ''));
                (date && (content = content.replace('<!-- datePlaceHolder -->', `date: ${date}`))) || (content = content.replace('<!-- datePlaceHolder -->', ''));
                (updated && (content = content.replace('<!-- updatedPlaceHolder -->', `updated: ${updated}`))) || (content = content.replace('<!-- updatedPlaceHolder -->', ''));
                (tags && (content = content.replace('<!-- tagsPlaceHolder -->', `tags: ["${tags.join('", "')}"]`))) || (content = content.replace('<!-- tagsPlaceHolder -->', ''));
                (categories && (content = content.replace('<!-- categoriesPlaceHolder -->', `categories: ["${categories}"]`))) || (content = content.replace('<!-- categoriesPlaceHolder -->', ''));
                content += `\r\n\r\n${post.body}`;

                fs.writeFileSync(join(dirname(__dirname) + `/dist/_posts/${post.number}.md`), content);
            });
        })
        .catch((e) => {
            console.log(e);
        });
}

module.exports = {
    main: main,
};
