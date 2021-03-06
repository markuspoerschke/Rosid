## Options

If you want more control over the `serve` or `compile` function, pass an object with the following parameters to them:

```js
{
	/*
	 * Option for the copy-module which will only run when compiling your site.
	 * [] = Ignore the following files when copying.
	 *      Must be an array of strings, which will be matched against absolute paths.
	 */
	ignore: [],
	/*
	 * Increase verbosity.
	 * true  = Log additional messages
	 * false = Only log important messages
	 */
	verbose: false,
	/*
	 * Option for the deliver-module which will only run when serving your site.
	 * It is typically necessary to set this to true to successfully watch files over a network,
	 * and it may be necessary to successfully watch files in other non-standard situations.
	 * true  = Use fs.watch
	 * false = Use fs.watchFile (backed by polling)
	 */
	polling: false,
	/*
	 * Decide if Rosid should automatically open your default browser.
	 * true  = Open '/index.html'
	 * false = Don't open URL
	 * ''    = Open custom URL
	 */
	open: false
}
```

Not all options are available in the [CLI of Rosid](CLI.md).