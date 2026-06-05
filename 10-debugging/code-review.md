## Code Review Exercise

Write your code review here in markdown format. 
## Code Review Exercise

### Issue #1: Accessibility — Empty Button

The accessibility issue is the "empty button" issue, meaning that the button is
either empty or has no value text. A button should always have a value, but
sometimes, we might use a glyphicon such as "x" to indicate this button is meant
to close the modal. To fix this issue, we can add an `aria-label` attribute.
It's also a good idea to add the `title` attribute, which will show the "title"
of the image as a tooltip when the user hovers over the image.

Initial code:

```html
<button class="close-popup-button">
  <i class="fa-solid fa-xmark"></i>
</button>
```

Updated code:

```html
<button
  class="close-popup-button"
  title="close popup button"
  aria-label="close popup button"
>
  <i class="fa-solid fa-xmark"></i>
</button>
```

---

### Issue #2: Correctness — Submit/Reset Buttons Outside the `<form>` Element

The submit and reset buttons are placed in a `<div>` that comes after the
closing `</form>` tag, meaning they are not descendants of the form. A
`<input type="submit">` or `<input type="reset">` only triggers form
submission or reset when it is inside the form it controls. As written,
clicking "submit" does nothing — the form data is never submitted.

Initial code:

```html
<form id="RequestInfo" class="content-container form">
  <!-- ...form fields... -->
</form>
<div class="form space-evenly-distributed-row-container form-buttons-container">
  <input class="form-button" type="submit" value="submit" />
  <input class="form-button" type="reset" value="reset" />
</div>
```

Updated code:

```html
<form id="RequestInfo" class="content-container form">
  <!-- ...form fields... -->
  <div class="space-evenly-distributed-row-container form-buttons-container">
    <input class="form-button" type="submit" value="submit" />
    <input class="form-button" type="reset" value="reset" />
  </div>
</form>
```

---

### Issue #3: Correctness — `fetch()` Does Not Check `response.ok`

The `fetchCatFacts` function uses `try/catch` which correctly handles network
failures, but never checks `response.ok` before calling `response.json()`.
The `fetch` Promise only rejects on network-level failures — it resolves
successfully even when the server returns an HTTP error like `404` or `500`.
In those cases the error is silently swallowed and the user sees nothing.

Initial code:

```javascript
try {
  const response = await fetch('https://catfact.ninja/facts?limit=10');
  const data = await response.json();
  data.data.forEach((element) => {
    const catFactItem = document.createElement('p');
    catFactItem.setAttribute('class', 'cat-fact-list-item');
    catFactItem.textContent = element.fact;
    catFactsList.append(catFactItem);
  });
} catch (error) {
  console.error('Error fetching cat facts:', error);
}
```

Updated code:

```javascript
try {
  const response = await fetch('https://catfact.ninja/facts?limit=10');
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  const data = await response.json();
  data.data.forEach((element) => {
    const catFactItem = document.createElement('p');
    catFactItem.setAttribute('class', 'cat-fact-list-item');
    catFactItem.textContent = element.fact;
    catFactsList.append(catFactItem);
  });
} catch (error) {
  console.error('Error fetching cat facts:', error);
  const catFactsList = document.getElementById('cat-facts-list');
  catFactsList.textContent = 'Failed to load cat facts. Please try again.';
}
```