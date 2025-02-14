import Conversion from "@/app/application/components/helper/conversion";

describe('HtmlJsonConverter', () => {

    it('should convert HTML to JSON correctly', () => {
        const div = document.createElement('div');
        div.innerHTML = '<p class="text">Hello <span>world</span>!</p>';

        const jsonResult = Conversion.htmlToJson(div);

        expect(jsonResult).toEqual({
            tag: 'div',
            attributes: {},
            children: [
                {
                    tag: 'p',
                    attributes: { class: 'text' },
                    children: [
                        { tag: 'text', attributes: {}, children: ['Hello '] },
                        {
                            tag: 'span',
                            attributes: {},
                            children: [{ tag: 'text', attributes: {}, children: ['world'] }]
                        },
                        { tag: 'text', attributes: {}, children: ['!'] }
                    ]
                }
            ]
        });
    });

    it('should convert JSON to HTML correctly', () => {
        const jsonExample = {
            tag: 'div',
            attributes: {},
            children: [
                {
                    tag: 'p',
                    attributes: { class: 'text' },
                    children: [
                        { tag: 'text', attributes: {}, children: ['Hello '] },
                        {
                            tag: 'span',
                            attributes: {},
                            children: [{ tag: 'text', attributes: {}, children: ['world'] }]
                        },
                        { tag: 'text', attributes: {}, children: ['!'] }
                    ]
                }
            ]
        };

        const htmlFromJson = Conversion.jsonToHtml(jsonExample);

        expect(htmlFromJson).toBe('<div><p class="text">Hello <span>world</span>!</p></div>');
    });

    it('should handle empty div correctly', () => {
        const div = document.createElement('div');
        const jsonResult = Conversion.htmlToJson(div);
        expect(jsonResult).toEqual({
            tag: 'div',
            attributes: {},
            children: []
        });

        const htmlFromJson = Conversion.jsonToHtml(jsonResult);
        expect(htmlFromJson).toBe('<div></div>');
    });
});
