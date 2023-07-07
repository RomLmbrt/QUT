# Introduction to React, Part 2

This practical follows on from the previous introduction to React. You will need to have completed the exercises in that sheet before you can work your way through this one. You will need the knowledge from that prac as a foundation for the new concepts considered here, and you will continue with the same CodeSandbox as before.

Again, it is important that you try the exercises before looking below for the
solutions. It is not much use just copying the code I have written if you do
not understand it.

Note that during development, it is good practice to keep your developer tools
open. If you have completed the 'Debugging JavaScript' practical, you should be
familiar with this concept.

# Goals

In this practical, we're going to take our very simple headline-rating
application, and extend it. First, we're going to have it render a list of items
that we're going to write ourselves. Then, we're going to connect our
application to an API ([NewsAPI](https://newsapi.org)) to download
headlines for us.

Once that is complete, we'll take a look at how to make the application a little
more presentable with some styling.

# Render a list

A common pattern in React is rendering a list of items. Having to manually write
out a bunch of components that essentially do the same thing gets very tedious very quickly. And if you're hand-writing all your components, it's hard
to render content dynamically, which is the life-blood of modern web
applications.

To start with, we're going to hard-code a list of headlines. This will serve as
a way to learn how to render a list, and as a placeholder which we will
eventually swap out with data from an API.

So, we will create an array of headlines. These are just strings, and you can 
include as many as you'd like (I'd recommend a minimum of 3 or 4, but any number will work). Feel free to make some up, or go to a news website and grab some from there. We're going to add this to the top of our `App` component for now.

```js
function App() {
  const headlines = [
    'My First Title',
    'My Second Title',
    'My Third Title',
    'My Fourth Title',
  ];

  // ...
}
```

Now that we have an array of headlines, let's replace the elements we're
returning. We start with the same `div` as before, but the contents change.
Let's take a look at it and we can try to understand what is happening.  

```js
function App() {
  const headlines = [
    'My First Title',
    'My Second Title',
    'My Third Title',
    'My Fourth Title',
  ];

  return (
    <div className="App">
      {headlines.map((headline) => (
        <Headline title={headline} />
      ))}
    </div>
  );
}
```

The "child" of our `div` is now very different. Recall that using
curly braces (`{}`) inside JSX switches back to regular JavaScript mode. So,
we're running some regular JavaScript, and using the `map` method from the
`Array` prototype to transform our headlines (which are just individual strings) into `Headline` components. The `map` function was covered as part of the functional JavaScript slides in an earlier lecture. It is a common idiom
in React, and it works by traversing the array and applying the function to each item. Whatever result is _returned_ from your function is then put into the
same position in a _new array_. That's an important note - `map` does _not_
mutate your original array. It creates a new array with the values you have
returned. You can read more about it
[here](https://codeburst.io/learn-understand-javascripts-map-function-ffc059264783)
if you'd like.

So, for every `headline` in `headlines`, we call a
function that accepts the `headline`, and we put that `headline` in as
the title. We then end up with an `Array` that looks like this internally:

```js
[
  <Headline title="My First Title" />,
  <Headline title="My Second Title" />,
  <Headline title="My Third Title" />,
  <Headline title="My Fourth Title" />,
];
```

When react gets an `Array` as the children of a component, it will render them
all inside the parent.

If you save and run your application, you should see your list of headlines, and
each headline should be interactive. However, if you have your developer tools open, and
you look in the console, you should see an error. It will read something like:

```
Warning: Each child in a list should have a unique "key" prop.

Check the render method of `App`. See https://fb.me/react-warning-keys for more
information.
```

The React team has worked very hard to make the error messages easy to understand. I strongly recommend you click on (or somehow visit) the link in the error for information.

The problem is that we have given React a list of items, but haven't given the
items any `key`s. At first, you may not understand the need for a key, and
indeed React will work just fine in a simple example like this. However, if you
want to start changing or updating that list, React _needs_ the `key` in order to keep track of which element is which. The reasons for this are beyond the scope of this practical, but I encourage you to read about it to get a deeper understanding.

So, we need to add a key to our list items. Unfortunately, we have no easy key that we can use, as there is no guarantee that the titles will be unique. Instead, let's add a fictional URL to our list of headlines. For now, we can use this as the `key`. In the future, we can have the headline link directly to the article it's from.

Let's update our `headlines` array to instead be an array of objects, with a
`title` and a `url`.

```js
function App() {
  const headlines = [
    { title: 'My First Title', url: 'https://news.com/first-title' },
    { title: 'My Second Title', url: 'https://news.com/second-title' },
    { title: 'My Third Title', url: 'https://news.com/third-title' },
    { title: 'My Fourth Title', url: 'https://news.com/fourth-title' },
  ];

  // as before
}
```

Your application will not now work. We need to update the `map` function to incorporate the new content.

```js
function App() {
  const headlines = [
    { title: 'My First Title', url: 'https://news.com/first-title' },
    { title: 'My Second Title', url: 'https://news.com/second-title' },
    { title: 'My Third Title', url: 'https://news.com/third-title' },
    { title: 'My Fourth Title', url: 'https://news.com/fourth-title' },
  ];

  return (
    <div className="App">
      {headlines.map((headline) => (
        // `headline` is now an object
        <Headline key={headline.url} title={headline.title} />
      ))}
    </div>
  );
}
```

We've added the URL (which is pretty much guaranteed to be unique) as the `key`,
so React can keep track of our `Array` elements. We've also updated the `title`
prop to get the title from inside our `headline` object.

That's all there is to it. You can now add headlines or remove them from the array, and when you save, you'll see the updated values.

# Accessing Data from an API

We're going to be using the [NewsAPI](https://newsapi.org/), for which you'll
need an API key. You can create a free API key
[here](https://newsapi.org/register).

Once you have your API key, create a new file called `api.js` and put your key
in this file using the format below.

```js
const API_KEY = 'your-key-goes-here';
```

Note: in practice, you wouldn't store an API key in your files directly - you'd
store it as an 'Environment Variable' that the compiler would pick up and insert
for you. This keeps it out of source control and mitigates the security risk. This process is beyond the scope of this practical, and this API key is not overly valuable.

Okay, so our plan of attack is as follows:

We're going to create a `useNewsArticles` React hook, similar to the standard `useState` hook that you saw in the earlier exercise. This will tell the component when it is loading, and when there is content ready.

Note: hooks in React are just functions that use one of the `use*` functions
exposed by React, such as `useState`. By convention, the name of your hook
should also start with `use`, making its role clear to the developer. 

So, in `api.js` we're going to start by declaring an exported function called
`useNewsArticles`. We probably don't need to pass any arguments at this stage. If you wanted to do [pagination](https://en.wikipedia.org/wiki/Pagination) or similar, you could pass in a page number here so that the API can keep track of position in the list. We're not going to do that for now.

You should have the following:

```js
export function useNewsArticles() {
  // TODO: implement this hook
}
```

Before we move on, have a think about what we're going to need to be able
implement this functionality.

We're going to need to be able to call the API, to keep track of the `loading`
state (because the API results aren't going to be available instantly), and keep
track of the data that is returned by the API.

The return values of this API are going to look something like the following:

```js
{
  loading: boolean, // indicating if the API is in progress or complete
  headlines: Array<{ title: string, url: string }>, // to hold our headlines
}
```

Note that we're missing a _very_ important element from the above. What happens
if the API fails to return successfully? We need to keep track of any error that may arise: 

```js
{
  loading: boolean, // indicating if the API is in progress or complete
  headlines: Array<{ title: string, url: string }>, // to hold our headlines
  error: Error | null, // if this is null, there is no error.
}
```

First things first: let's focus on the loading state alone. We're going to need
some state to keep track of the value. And, for now, we're going to copy across
our existing headlines array so we can return something useful.

Finally, we're going to return the object described above. You should have
something that looks like this:

```js
import { useState } from 'react';

const API_KEY = '...';

export function useNewsArticles() {
  const [loading, setLoading] = useState(true);

  const headlines = [
    { title: 'My First Title', url: 'https://news.com/first-title' },
    { title: 'My Second Title', url: 'https://news.com/second-title' },
    { title: 'My Third Title', url: 'https://news.com/third-title' },
    { title: 'My Fourth Title', url: 'https://news.com/fourth-title' },
  ];

  return {
    loading,
    headlines,
    error: null,
  };
}
```

Some things to note:

- We're setting `loading` to `true` to start with, because the first thing we're
  going to do is load the data. There is no point making it false, and then true
  straight away - that will cause excessive renders in our application.
- We're setting the error to `null` explicitly, because we have no errors to
  handle yet.

Okay! Now that we have a working hook (even if it doesn't really _do_ anything
yet), we can use it in our main application. Back in `index.js`, import your new
hook at the top of the file:

```js
// these are already there
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
// add this one
import { useNewsArticles } from './api'; // import from a local file
```

Then, in our `App`, we can use [object
destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring)
to handle our hooks return values. You can remove the `headlines` array, and
we're going to add the hook usage. You should have the following:

```js
function App() {
  const { loading, headlines, error } = useNewsArticles();

  return (
    <div className="App">
      {headlines.map((headline) => (
        // `headline` is now an object
        <Headline key={headline.url} title={headline.title} />
      ))}
    </div>
  );
}
```

You should see no difference in your application - remember that we're just
giving it the same headlines we had before.

Now, we need to deal with our loading state. If the application is loading, we
don't want to display incomplete data to the user. We're going to check if
`loading` is `true`, and if it is, return some text saying 'Loading...'.

**Exercise**: If `loading` is `true`, return a `p` tag that says `loading`
instead of our existing elements.

There are a couple of ways you could have done this. This first is the most
simple:

```js
function App() {
  const { loading, headlines, error } = useNewsArticles();

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="App">
      {headlines.map((headline) => (
        <Headline key={headline.url} title={headline.title} />
      ))}
    </div>
  );
}
```

Alternatively, you can use a
[ternary](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)
to put the loading text inside the `div`, usually for styling reasons:

```js
function App() {
  const { loading, headlines, error } = useNewsArticles();

  return (
    <div className="App">
      {loading ? (
        <p>Loading...</p>
      ) : (
        headlines.map((headline) => (
          <Headline key={headline.url} title={headline.title} />
        ))
      )}
    </div>
  );
}
```

Both of these are valid, depending on the content. We're going to go with the
first one for this practical.

Your application is probably _very_ boring now - it just shows 'Loading...'
forever. Let's change that by _faking_ the change to our loading state. For 
this, we're going to use another built-in hook called `useEffect`. `useEffect` runs your code when your component mounts the first time, and then doesn't run again (we'll look at how to make it run again later). This is useful for things that
you want to happen _once_ (like side effects) - without `useEffect`, the code
would run every time the hook updates (such as by calling `useState`). You can
read more in-depth documentation on `useEffect` in the [React
Docs](https://reactjs.org/docs/hooks-effect.html)

`useEffect` takes a function to execute as its first argument, and then a list
of 'dependencies'. These are variables that should make the hook re-run when
they change. Because we only need to fake our loading state one-time, we're
going to set this list to `[]`.

Inside `api.js`, add `useEffect` next to the `useState` import. Then in
`useNewsArticles`, we're going to add the following below our `loading` state:

```js
useEffect(
  // the effect
  () => {
    setTimeout(() => {
      setLoading(false); // pretend we're no longer loading
    }, 2000); // wait 2 seconds before loading is finished
  },
  // the dependencies
  [],
);
```

Let's break down what's happening. We're passing `useEffect` our 'effect' to
run, and saying that it should _never_ run again (because we're passing an empty
array as the 'dependencies'). Then, inside the effect, we're calling
`setTimeout` to schedule some work to happen in the future. In this case, in the
future, we want to set our `loading` value to `false` - indicating to the
application that loading is now complete, and we should show the data. The
second argument to `setTimeout` is how many milliseconds into the future we
should run this (2 seconds in our case).

Saving your application, you should see your now-familiar 'Loading...' state,
and then after about 2 seconds, you should see your list of headlines.

Brilliant! We now have an application that "loads" some data while displaying a
(very simple) loading state, and then displays the data when it's "ready". This
is a good way of breaking up your work into manageable chunks - fake (or "mock"
in more common developer terminology) whatever you're not directly working on until it
works the way you want. Then you can move on to the next chunk, safe in the
knowledge that the previous chunk works as you want it to.

Our next 'chunk' is to actually get data from the API. We're going to create a
new function to do this so we can keep our `useNewsArticles` function clean and
understandable. Create a new function called `getHeadlines` in `./api.js`.

**Exercise**: A lot of web development involves reading API documentation to
find what you need. Your task is to go to [NewsAPI](https://newsapi.org), and
find the URL you need to get the top headlines for Australia.

Now that you have found the URL, we can implement our `getHeadlines` function.
We're going to use `fetch` to get that data from the API, and for now, I'm just
going to log it to the console.

```js
function getHeadlines() {
  const url = `https://newsapi.org/v2/top-headlines?country=au&apiKey=${API_KEY}`;

  fetch(url)
    .then((res) => res.json())
    .then((res) => console.log(res));
}
```

We're using [template
literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
to 'inject' our API key. Then, we're `fetch`ing the URL, converting it to JSON
(because we have a good reason to believe that it will be JSON from the
documentation), and then logging the JSON response.

To test this, call it from within your `useEffect` in `useNewsArticles` - if you
don't do this, the `getHeadlines` function will be called every time the page
re-renders. We only want to call it _once_, when the page loads.

Okay, now that we've got the results back from our API, let's _transform_ them
to look the same as our headlines do. From the API docs, we can see that the
response has a `status`, `totalResults` and `articles`. `articles` is an array
that contains objects that have a `title` and a `url`. That's handy - it's
exactly what we need. So, we're going to get just the array of articles, and
then get rid of all the fields on the object except for `title` and `url`.

**Exercise**: Update your `fetch` promise chain to end up with just an array of
`title` and `url`.

```js
fetch(url)
  .then((res) => res.json())
  .then((res) => res.articles) // get just the list of articles
  .then((articles) =>
    articles.map((article) => ({
      title: article.title,
      url: article.url,
    })),
  );
```

The final thing we need to do inside `getHeadlines` is return the `fetch`
promise so we can use the result later. Overall, `getHeadlines` should look like
this:

```js
function getHeadlines() {
  const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;

  return fetch(url)
    .then((res) => res.json())
    .then((res) => res.articles) // get just the list of articles
    .then((articles) =>
      // get just the title and url from each article
      articles.map((article) => ({
        title: article.title,
        url: article.url,
      })),
    );
}
```

Now, we can get rid of our fake loading state! Inside of `useNewsArticles`, in
the effect, remove the `setTimeout`, and instead, call the following:

```js
getHeadlines().then((headlines) => {
  setLoading(false);
});
```

Now, to display the headlines we got back from the API, we need to keep them in
some state.

**Exercise**: Create some state for your headlines. It should be an empty array
initially. When the headlines are retrieved from `getHeadlines`, and you're
setting `loading` to `false`, also store your headlines in the state.

You should end up with something like this:

```js
useEffect(() => {
  getHeadlines().then((headlines) => {
    setHeadlines(headlines);
    setLoading(false);
  });
});
```

There are a couple of things to note here:

- I am setting `headlines` before marking `loading` as complete. This is because
  if we mark `loading` as `true` first, there is a small window of time when
  `loading` is `true` and `headlines` is still `[]`. This way, we make sure that
  we have the headlines before removing the loading state. In practice, this
  makes _very_ little difference, but is good to think about.
- This is _not_ the most efficient way of doing things. Theoretically, we're causing
  two re-renders, because setting state results in a re-render. However, this is
  easy to understand and follow (a _very_ important quality to have in code),
  and React is fairly well-optimised for these situations. It's something to keep in
  mind if you are working on applications for which performance is critical, but in
  general, you can ignore these micro-optimisations until a long way down the
  track.

Great! Save, refresh, and you should see your loading state, and then a list of
headlines. We do have one thing to handle still - the error state.

**Exercise**: Create some state to hold the error in. It should be `null`
initially. `catch` any errors from the `getHeadlines` promise and store them in
the `error` state. In you `App` component, if there is an error, display
'Something went wrong' followed by the error message.

Our final `useNewsArticles` looks like this:

```js
export function useNewsArticles() {
  const [loading, setLoading] = useState(true);
  const [headlines, setHeadlines] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getHeadlines()
      .then((headlines) => {
        setHeadlines(headlines);
        setLoading(false);
      })
      .catch((e) => {
        setError(e);
        setLoading(false);
      });
  }, []);

  return {
    loading,
    headlines,
    error,
  };
}
```

and our final `App` looks like this:

```js
function App() {
  const { loading, headlines, error } = useNewsArticles();

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Something went wrong: {error.message}</p>;
  }
  return (
    <div className="App">
      {headlines.map((headline) => (
        // `headline` is now an object
        <Headline key={headline.url} title={headline.title} />
      ))}
    </div>
  );
}
```

Congratulations! You've just made your first React application that interfaces
with an external API. And all in under 100 lines of code. That's the power of
React - make applications that work well, and provide a pretty good user
experience, and all in a reasonably limited amount of code.

## Resources

- [More reading on why lists need
  keys](https://reactjs.org/docs/lists-and-keys.html#keys)
- [In-depth explanation of why lists need
  keys](https://reactjs.org/docs/reconciliation.html#recursing-on-children)
