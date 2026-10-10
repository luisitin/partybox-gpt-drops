"""Extract source-spelled names and category headings from Mario Party Legacy.

No spelling corrections or cross-source aliases are applied. Only the trailing
parenthetical attribution to an earlier Mario Party game is excluded from names.
"""
from html.parser import HTMLParser
import re


def _tidy(text):
    return re.sub(r"\s+", " ", text).strip()


class LegacyIndexParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.heading_text = None
        self.heading_anchor = None
        self.category = None
        self.table_depth = 0
        self.cell_number = 0
        self.name_text = None
        self.paragraph_text = None
        self.rows = []
        self.categories = []
        self.paragraphs = []
        self.intro_paragraphs = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "h2":
            self.heading_text = []
            self.heading_anchor = attrs.get("id")
        if tag == "table":
            self.table_depth += 1
        if tag == "tr" and self.category and self.table_depth:
            self.cell_number = 0
        if tag == "td" and self.category and self.table_depth:
            self.cell_number += 1
            if self.cell_number == 2:
                self.name_text = []
        if tag == "p":
            self.paragraph_text = []
        if tag == "br":
            if self.name_text is not None:
                self.name_text.append("\n")
            if self.paragraph_text is not None:
                self.paragraph_text.append("\n")

    def handle_endtag(self, tag):
        if tag == "h2" and self.heading_text is not None:
            heading = _tidy("".join(self.heading_text))
            match = re.fullmatch(r"(.+?) \((\d+)\)", heading)
            self.category = None
            if match:
                self.category = {
                    "categoryPath": [match[1]],
                    "categoryAnchor": self.heading_anchor,
                    "headingLabel": heading,
                    "declaredCount": int(match[2]),
                }
                self.categories.append(self.category)
            self.heading_text = None
        if tag == "table":
            self.table_depth -= 1
        if tag == "td" and self.name_text is not None:
            raw = _tidy("".join(self.name_text))
            name = re.sub(r"\s*\(Mario Party(?: \d+)?\)\s*$", "", raw)
            self.rows.append({
                "name": name,
                "categoryPath": self.category["categoryPath"][:],
                "categoryAnchor": self.category["categoryAnchor"],
            })
            self.name_text = None
        if tag == "p" and self.paragraph_text is not None:
            paragraph = _tidy("".join(self.paragraph_text))
            if paragraph:
                self.paragraphs.append(paragraph)
                if not self.categories:
                    self.intro_paragraphs.append(paragraph)
            self.paragraph_text = None

    def handle_data(self, text):
        if self.heading_text is not None:
            self.heading_text.append(text)
        if self.name_text is not None:
            self.name_text.append(text)
        if self.paragraph_text is not None:
            self.paragraph_text.append(text)


def parse_legacy(text):
    """Return rows, source category counts, and original introductory paragraphs."""
    parser = LegacyIndexParser()
    parser.feed(text)
    parser.close()
    return {
        "rows": parser.rows,
        "categories": parser.categories,
        "paragraphs": parser.paragraphs,
        "introParagraphs": parser.intro_paragraphs,
        "countParagraphs": [
            p for p in parser.paragraphs
            if re.search(r"\b\d+\s+Super Mario Party Jamboree minigames\b", p)
        ],
    }


if __name__ == "__main__":
    import argparse
    import json
    from pathlib import Path
    cli = argparse.ArgumentParser()
    cli.add_argument("html_file", type=Path)
    arguments = cli.parse_args()
    print(json.dumps(parse_legacy(arguments.html_file.read_text()), ensure_ascii=False, indent=2))
