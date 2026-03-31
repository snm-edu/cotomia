from pypdf import PdfReader
reader = PdfReader("pre_dokkai_kaitou.pdf")
text = ""
for page in reader.pages:
    text += page.extract_text()
with open("pdf_kaitou.txt", "w") as f:
    f.write(text)

reader2 = PdfReader("pre_dokkai2.pdf")
text2 = ""
for page in reader2.pages:
    text2 += page.extract_text()
with open("pdf_text.txt", "w") as f:
    f.write(text2)
