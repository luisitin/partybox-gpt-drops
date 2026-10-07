"""Extract wiki list labels only; exclude image links and display markers from names."""
from html.parser import HTMLParser
import html, re
class WikiIndexParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack=[]; self.heading_tag=None; self.heading_capture=None; self.path=[]; self.anchors=[]
        self.gallery=None; self.link=None; self.rows=[]
    def handle_starttag(self, tag, attrs):
        a=dict(attrs); depth=len(self.stack)
        if tag not in {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}:
            self.stack.append(tag)
        if tag in ('h2','h3'):self.heading_tag=tag
        if tag=='span' and 'mw-headline' in a.get('class','').split():
            self.heading_capture={'depth':depth,'level':self.heading_tag,'id':a['id'],'parts':[]}
        if tag=='div' and 'gallerytext' in a.get('class','').split():
            self.gallery={'depth':depth,'parts':[],'name':None,'href':None}
        if self.gallery and tag=='a' and self.gallery['name'] is None and self.link is None and a.get('href','').startswith('/') and not a['href'].startswith('/File:'):
            self.link={'depth':depth,'href':a['href'],'parts':[]}
    def handle_endtag(self, tag):
        if tag in self.stack:
            idx=len(self.stack)-1-self.stack[::-1].index(tag)
        else:return
        if self.link and tag=='a' and idx==self.link['depth']:
            self.gallery['name']=''.join(self.link['parts']).strip(); self.gallery['href']=self.link['href'];self.link=None
        if self.heading_capture and tag=='span' and idx==self.heading_capture['depth']:
            h=self.heading_capture; value=''.join(h['parts']).strip()
            if h['level']=='h2':self.path=[value];self.anchors=[h['id']]
            else:self.path=self.path[:1]+[value];self.anchors=self.anchors[:1]+[h['id']]
            self.heading_capture=None
        if self.gallery and tag=='div' and idx==self.gallery['depth']:
            g=self.gallery
            assert g['name'] and len(self.path),g
            self.rows.append({'name':g['name'],'categoryPath':self.path[:],'categoryAnchor':self.anchors[-1],'articlePath':g['href'],'galleryLabel':' '.join(''.join(g['parts']).split()),'edition':'jamboree_tv' if self.path[0]=='Jamboree TV minigames' else 'base'})
            self.gallery=None
        del self.stack[idx:]
        if tag in ('h2','h3'):self.heading_tag=None
    def handle_data(self,data):
        if self.heading_capture:self.heading_capture['parts'].append(data)
        if self.gallery:self.gallery['parts'].append(data)
        if self.link:self.link['parts'].append(data)
def parse_wiki(text):
    p=WikiIndexParser();p.feed(text);p.close()
    paragraphs=[' '.join(html.unescape(re.sub(r'<[^>]*>','',x)).split()) for x in re.findall(r'<p>(.*?)</p>',text,re.S)]
    return {'rows':p.rows,'paragraphs':paragraphs}
