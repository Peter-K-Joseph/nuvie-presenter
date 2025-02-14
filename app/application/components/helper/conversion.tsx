class Conversion {
  // Convert HTML to JSON
  static htmlToJson(element: HTMLElement): any {
    let obj: any = {
      tag: element.tagName.toLowerCase(),
      attributes: {},
      children: [],
      text: element.textContent?.trim() || "",
    };

    // Add attributes to the JSON object
    for (let attr of Array.from(element.attributes)) {
      obj.attributes[attr.name] = attr.value;
    }

    // Recursively convert children elements
    for (let child of Array.from(element.children)) {
      obj.children.push(Conversion.htmlToJson(child as HTMLElement));
    }

    return obj;
  }

  // Convert JSON to HTML
  static jsonToHtml(json: any): string {
    // Start building the HTML string
    let htmlString = `<${json.tag}`;

    // Add attributes to the HTML tag
    for (let [key, value] of Object.entries(json.attributes)) {
      htmlString += ` ${key}="${value}"`;
    }

    htmlString += ">";

    // Add text content if available
    if (json.text) {
      htmlString += json.text;
    }

    // Recursively build HTML from children elements
    for (let child of json.children) {
      htmlString += Conversion.jsonToHtml(child);
    }

    htmlString += `</${json.tag}>`;

    return htmlString;
  }

  static jsonToHtmlElement(json: any): HTMLElement {
    // Create the element
    const element = document.createElement(json.tag);

    // Set attributes
    for (const [key, value] of Object.entries(json.attributes)) {
      element.setAttribute(key, value);
    }

    // Set text content if available
    if (json.text) {
      element.textContent = json.text;
    }

    // Recursively process children
    for (const child of json.children) {
      element.appendChild(Conversion.jsonToHtmlElement(child));
    }

    return element;
  }
}

export default Conversion;
