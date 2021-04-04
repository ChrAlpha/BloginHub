# BloginHub

> May be the fastest way to start bloging with Hexo!

Share you ideas with [GitHub Issues](https://guides.github.com/features/issues/) & [Hexo](https://github.com/hexojs/hexo)!

## First to use

0. Click on the **Use this template** button on the top right, enter the name for your new repository
1. Generate a new [personal access token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token), [create a secrets](https://docs.github.com/en/actions/reference/encrypted-secrets#creating-encrypted-secrets-for-a-repository) for this repository, name as `token` and paste your personal access token into Value field (make sure no spaces or linebreaks before/after the token)
2. Configurate the `_config.yml` files, the `repo` and `theme` are required
3. (Optional) Configurate the `src/site_config.yml` as Hexo Site Config file and `src/theme_config` as Hexo Theme Config file
4. (Optional) If you've used Hexo before, just upload all files from `source/` in your Hexo path to `dist/` in this repository

## Write new post

All you have to do to create a new post in blog is to open an issue in this repository. Here are some correspondences:

1. Issue body: post content
2. Issue title: post title
3. Issue created time: post created time
4. Issue updated time: post updated time
5. Issue labels: post tags
6. Issue milestone: post category

## Website deployment

BloginHub will deploy website to [GitHub Pages](https://pages.github.com/) by default.

1. You have to start deployment manually, by clicking the **Run workflow** in **Actions**.<br>![run-workflows-manually](https://user-images.githubusercontent.com/53332481/113496614-03387d00-952e-11eb-90b5-90feb7dc57b7.png)
2. Go to repository settings page, scroll to **GitHub Pages** settings, under **source** change `none` to `gh-pages`
3. (Optional) Configurate custom domain in `_config.yml` by modifying `url`

## License

**BloginHub** © [ChrAlpha](https://github.com/ChrAlpha), Released under the [MIT](/LICENSE) License.

>   [Personal HomePage](https://ichr.me/) · [Blog](https://blog.ichr.me/) · GitHub [@ChrAlpha](https://github.com/ChrAlpha) · Telegram Channel [@ChrAlphaChannel](https://t.me/s/ChrAlphaChannel) · Twitter [@ichralpha](https://twitter.com/ichralpha) · Keybase [@chralpha](https://keybase.io/chralpha) 