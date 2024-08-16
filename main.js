const puppeteer = require("puppeteer");
const handlebars =  require("handlebars");
const fs =  require("fs");
const path = require("path");

 async function generatePdf(data) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    const content = await compile("template", data);
    await page.setContent(content);
    const pdf = await page.pdf({
      // path: "output.pdf",
      format: "A4",
      printBackground: true,
    });
    await browser.close();
    return pdf;
  } catch (err) {
    console.log(err);
  }
}

 const compile = async function (templateName, data) {
  const filePath = path.join(process.cwd(), `${templateName}.hbs`);
  const html = fs.readFileSync(filePath, "utf8");
  return handlebars.compile(html)(data);
};

handlebars.registerHelper("statusColor", function (status) {
  switch (status) {
    case "CREATED":
      return "#3F98D8";
    case "VALID":
      return "#22A77D";
    case "PENDING":
      return "#D8C93F";
    case "PROCESSING":
      return "#D8883F";
    case "SUCCESS":
      return "#3FD8A2";
    case "ERROR":
      return "#D8513F";
    case "CANCELLED":
      return "#C5C2C2";
    case "EXPIRED":
      return "#703FD8";
    default:
      return "black"; // default color
  }
});

async function getPdf() {
  const response = await fetch(
    ""
  );
  const data = await response.json();

  const pdf = await generatePdf(data);
  const filePath = "./output.pdf"; // Change the file path as needed

  // Write the PDF blob to a file
  fs.writeFile(filePath, pdf, "binary", (err) => {
    if (err) {
      console.error("Error saving the PDF file:", err);
    } else {
      console.log("PDF file saved successfully!");
    }
  });
}

getPdf()