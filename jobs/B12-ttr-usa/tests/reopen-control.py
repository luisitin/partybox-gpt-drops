import ast,concurrent.futures,hashlib,http.server,json,pathlib,re,tempfile,threading,urllib.request
from datetime import datetime,timezone
rootSource=pathlib.Path(__file__).resolve().parent.parent
body=b'Transport-only synthetic control bytes. These are not source facts or publisher PDF content.\\n'
def component(sourceText,original=False,realBytes=None,realDigest=None):
 parsed=ast.parse(sourceText);node=next(n for n in parsed.body if isinstance(n,ast.FunctionDef)and n.name=='fetch')
 actual=ast.Module(body=[node],type_ignores=[]);payload=body if realBytes is None else realBytes
 class Handler(http.server.BaseHTTPRequestHandler):
  def do_GET(self):
   self.send_response(200);self.end_headers();self.wfile.write(payload+b'changed'if self.path.endswith('/changed.pdf')else payload)
  def log_message(self,*args):pass
 with tempfile.TemporaryDirectory(prefix='b12-reopen-control-')as tmp:
  root=pathlib.Path(tmp);out=root/'output';out.mkdir()
  server=http.server.ThreadingHTTPServer(('127.0.0.1',0),Handler);thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
  env={'root':root,'out':out,'urllib':urllib,'hashlib':hashlib,'re':re}
  exec(compile(actual,'actual-reopen-fetch-component','exec'),env);fetch=env['fetch']
  digest=hashlib.sha256(payload).hexdigest()if realDigest is None else realDigest
  item={'url':'http://127.0.0.1:'+str(server.server_port)+'/same.pdf','firstLocalFile':'sources/ignored-first.pdf','firstSha256':digest}
  try:
   assert not(root/item['firstLocalFile']).exists()
   if original:
    try:fetch(('official-base',item))
    except FileNotFoundError:pass
    else:raise AssertionError('original missing ignored PDF failure was not reproduced')
    return {'originalFailure':'FileNotFoundError','actualComponentExecuted':True,'recordedSHA256':digest,'bytes':len(payload),'scope':'controlled actual HTTP transport only; no fresh source reopening or fact promotion'}
   name,result=fetch(('official-base',item));assert name=='official-base'and result['sha256']==digest and result['httpStatus']==200
   changed={**item,'url':'http://127.0.0.1:'+str(server.server_port)+'/changed.pdf'}
   try:fetch(('official-base',changed))
   except AssertionError:pass
   else:raise AssertionError('changed actual HTTP bytes accepted')
   badHash={**item,'firstSha256':'bad'}
   try:fetch(('official-base',badHash))
   except AssertionError:pass
   else:raise AssertionError('bad recorded hash accepted')
   local=root/item['firstLocalFile'];local.parent.mkdir();local.write_bytes(payload);fetch(('official-base',item))
   local.write_bytes(payload+b'bad-cache')
   try:fetch(('official-base',item))
   except AssertionError:pass
   else:raise AssertionError('disagreeing present first file accepted')
   return {'passed':True,'actualComponentExecuted':True,'controls':5,'bytes':len(payload),'transportOnly':True,'freshResearchClaim':False,'completedUTC':datetime.now(timezone.utc).isoformat()}
  finally:server.shutdown();server.server_close();thread.join()
if __name__=='__main__':print(json.dumps(component((rootSource/'tools/reopen.py').read_text())))
