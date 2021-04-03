'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const fetch = require('node-fetch');
const { join, dirname } = require('path');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const data = yaml.load(fs.readFileSync(join(dirname(__dirname) + '/_config.yml'), 'utf-8'));

function generate_issue(title) {
    fetch(`https://api.github.com/repos/${data.repo}/issues`, {
        method: 'POST',
        headers: {
            Accept: 'application/vnd.github.v3+json',
            Authorization: `token ${GITHUB_TOKEN}`,
        },
        body: {
            title: title,
        },
    })
        .then((response) => {
            return response.json();
        })
        .then((post) => {
            generate_files(post.number);
        })
        .catch((e) => {
            console.log(e);
        });
}

function generate_files(id) {
    if (!fs.existsSync(join(dirname(__dirname) + `/dist/_posts/`))) {
        fs.mkdirSync(join(dirname(__dirname) + `/dist/_posts/`), { recursive: true });
    }
    if (id === undefined) {
        fetch(`https://api.github.com/repos/${data.repo}/issues`, {
            method: 'GET',
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((list) => {
                list.forEach((postEntry) => {
                    if (!fs.existsSync(join(dirname(__dirname) + `/dist/_posts/${postEntry.number}.md`))) {
                        let content = '';
                        (content += '---\r\n'), (content += '<!-- titlePlaceHolder -->\r\n'), (content += '<!-- datePlaceHolder -->\r\n'), (content += '<!-- updatedPlaceHolder -->\r\n'), (content += '<!-- tagsPlaceHolder -->\r\n'), (content += '<!-- categoriesPlaceHolder -->\r\n');
                        if (data.front_matter) {
                            data.front_matter.forEach((item) => {
                                content += `${item}\r\n`;
                            });
                        }
                        (content += '---\r\n\r\n'), (content += '<!-- generateByBloginhub -->\r\n\r\n');

                        fs.writeFileSync(join(dirname(__dirname) + `/dist/_posts/${postEntry.number}.md`), content);
                    }
                });
            })
            .catch((e) => {
                console.log(e);
            });
    } else if (!fs.existsSync(join(dirname(__dirname) + `/dist/_posts/${id}.md`))) {
        let content = '';
        (content += '---\r\n'), (content += '<!-- titlePlaceHolder -->\r\n'), (content += '<!-- datePlaceHolder -->\r\n'), (content += '<!-- updatedPlaceHolder -->\r\n'), (content += '<!-- tagsPlaceHolder -->\r\n'), (content += '<!-- categoriesPlaceHolder -->\r\n');
        if (data.front_matter) {
            data.front_matter.forEach((item) => {
                content += `${item}\r\n`;
            });
        }
        (content += '---\r\n\r\n'), (content += '<!-- generateByBloginhub -->\r\n\r\n');

        fs.writeFileSync(join(dirname(__dirname) + `/dist/_posts/${id}.md`), content);
    }
}

function remove_files(id) {
    if (id === undefined) {
        fs.readdirSync(join(dirname(__dirname) + `/dist/_posts/`)).forEach((file) => {
            const content = fs.readFileSync(file, 'utf-8');
            if (!content.match('<!-- generateByBloginhub -->')) {
                id = file.replace(/(.*?)\/dist\/_posts\/(\d+).md/gi, (str, p1, p2) => p2);
                fetch(`https://api.github.com/repos/${data.repo}/issues/${id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `token ${GITHUB_TOKEN}`,
                    },
                })
                    .then((response) => {
                        return response.json();
                    })
                    .then((post) => {
                        if (!post.state || post.state !== 'open') {
                            fs.unlinkSync(join(dirname(__dirname) + `/dist/_posts/${id}.md`));
                        }
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            }
        });
    } else {
        fs.unlinkSync(join(dirname(__dirname) + `/dist/_posts/${id}.md`));
    }
}

module.exports = {
    generate_files: generate_files,
    remove_files: remove_files,
    generate_issue: generate_issue,
};
