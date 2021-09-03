//imports
import user from "../app_config";
//imports

export default class RawPrint {
  static new_sale = (v) => {
    console.log(v);
    const values = v.products_sold;
    const total_amount = parseInt(v.total_amount);
    const discount = parseInt(v.discount) || 0;
    const amount_paid = parseInt(v.pay_amount);
    const customer = v.customer;
    const sale = v.customer ? "Wholesale" : "Retail";
    // return [
    //   "\x1B" + "\x40", // init
    //   "\x1B" + "\x61" + "\x31", // center align
    //   "Beverly Hills, CA  90210" + "\x0A",
    //   "\x0A", // line break
    //   "www.qz.io" + "\x0A", // text and line break
    //   "\x0A", // line break
    //   "\x0A", // line break
    //   "May 18, 2016 10:30 AM" + "\x0A",
    //   "\x0A", // line break
    //   "\x0A", // line break
    //   "\x0A",
    //   "Transaction # 123456 Register: 3" + "\x0A",
    //   "\x0A",
    //   "\x0A",
    //   "\x0A",
    //   "\x1B" + "\x61" + "\x30", // left align
    //   "Baklava (Qty 4)       9.00" + "\x1B" + "\x74" + "\x13" + "\xAA", //print special char symbol after numeric
    //   "\x0A",
    //   "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" + "\x0A",
    //   "\x1B" + "\x45" + "\x0D", // bold on
    //   "Here's some bold text!",
    //   "\x1B" + "\x45" + "\x0A", // bold off
    //   "\x0A" + "\x0A",
    //   "\x1B" + "\x61" + "\x32", // right align
    //   "\x1B" + "\x21" + "\x30", // em mode on
    //   "DRINK ME",
    //   "\x1B" + "\x21" + "\x0A" + "\x1B" + "\x45" + "\x0A", // em mode off
    //   "\x0A" + "\x0A",
    //   "\x1B" + "\x61" + "\x30", // left align
    //   "------------------------------------------" + "\x0A",
    //   "\x1B" + "\x4D" + "\x31", // small text
    //   "EAT ME" + "\x0A",
    //   "\x1B" + "\x4D" + "\x30", // normal text
    //   "------------------------------------------" + "\x0A",
    //   "normal text",
    //   "\x1B" + "\x61" + "\x30", // left align
    //   "\x0A" + "\x0A" + "\x0A" + "\x0A" + "\x0A" + "\x0A" + "\x0A",
    //   "\x1B" + "\x45" + "\x4d" + "\x20" + "\x34",
    //   // "\x1B" + "\x69", // cut paper (old syntax)
    //   // '\x1D' + '\x56'  + '\x00' // full cut (new syntax)
    //   // '\x1D' + '\x56'  + '\x30' // full cut (new syntax)
    //   // '\x1D' + '\x56'  + '\x01' // partial cut (new syntax)
    //   // '\x1D' + '\x56'  + '\x31' // partial cut (new syntax)
    //   "\x10" + "\x14" + "\x01" + "\x00" + "\x05", // Generate Pulse to kick-out cash drawer**
    //   // **for legacy drawer cable CD-005A.  Research before using.
    // ];
    //functions
    const getDate = () => {
      let date =
        new Date(Date.now()).getDate() +
        "/" +
        (new Date(Date.now()).getMonth() + 1) +
        "/" +
        new Date(Date.now()).getFullYear();
      return date;
    };

    const getNameSpaces = (n, i) => {
      let name = n.split(" ")[0];
      let name_formatted;
      if (name.length === i) {
        name_formatted = name;
      }
      if (name.length > i) {
        name_formatted = name.substring(0, i);
      }
      if (name.length < i) {
        name_formatted = name;
        let spaces = i - name.length;
        for (let i = 0; i < spaces; i++) {
          name_formatted = name_formatted + " ";
        }
      }
      return name_formatted;
    };
    //functions
    let data = [
      "\x1B" + "\x40",
      "\x1B" + "\x61" + "\x30", // left align
      "FREEDOM HEALTH AND SUPPLIES LTD" + "\x4C" + "\x46",
      "Plot 7, Chegere Road Apac" + "\x0A", // text and line break
      "P.O.Box 120 Apac" + "\x0A", // text and line break
      "Tel: 0393 193 423" + "\x0A", // text and line break
      "\x0A",
      "\x1B" + "\x45" + "\x0D", // bold on
      "SALES RECEIPT" + "\x0A", // text and line break
      "\x1B" + "\x45" + "\x0A",
      `Date: ${getDate()}` + "\x0A", // text and line break
      "\x0A", // text and line break
      `${customer ? `Customer:  ${customer}` : ""}` + "\x0A",
      "---------------------------------------------" + "\x0A",
      "\x1B" + "\x45" + "\x0D", // bold on
      "Name                Qty   Unit     Amount(Shs)" + "\x0A",
      "\x1B" + "\x45" + "\x0A", // bold off
    ]; // text and line break
    values.forEach((v, i) => {
      data.push(
        `${getNameSpaces(v.product_name, 20)}${getNameSpaces(
          v.qty,
          6
        )}${getNameSpaces(v.selling_unit, 10)}${
          parseInt(v.product_price) * parseInt(v.qty)
        }` + "\x0A"
      );
    });

    data.push("\x1B" + "\x45" + "\x0D");
    let data_with_footer = [
      ...data,
      "\x1B" + "\x45" + "\x0A", // bold off
      "---------------------------------------------" + "\x0A",
      "\x0A",
      `Sale       ${sale}` + "\x0A",
      `Total      UGX: ${total_amount}` + "\x0A",
      `Discount   UGX: ${discount}` + "\x0A",
      `Paid       UGX: ${amount_paid}` + "\x0A",
      "\x0A",
      "Thank You" + "\x0A",
      `Served By: ${user.user.user_first_name}` + "\x0A",
      "Be Healthy, Be Happy" + "\x0A",
      "\x0A",
      "\x1B" + "\x45" + "\x4d" + "\x20" + "\x34",
    ];

    return data_with_footer;
  };
}

//Set content to print...
//Create ESP/POS commands for sample label
var esc = "\x1B"; //ESC byte in hex notation
var newLine = "\x0A"; //LF byte in hex notation

var cmds = esc + "@"; //Initializes the printer (ESC @)
cmds += esc + "!" + "\x38"; //Emphasized + Double-height + Double-width mode selected (ESC ! (8 + 16 + 32)) 56 dec => 38 hex
cmds += "BEST DEAL STORES"; //text to print
cmds += newLine + newLine;
cmds += esc + "!" + "\x00"; //Character font A selected (ESC ! 0)
cmds += "COOKIES                   5.00";
cmds += newLine;
cmds += "MILK 65 Fl oz             3.78";
cmds += newLine + newLine;
cmds += "SUBTOTAL                  8.78";
cmds += newLine;
cmds += "TAX 5%                    0.44";
cmds += newLine;
cmds += "TOTAL                     9.22";
cmds += newLine;
cmds += "CASH TEND                10.00";
cmds += newLine;
cmds += "CASH DUE                  0.78";
cmds += newLine + newLine;
cmds += esc + "!" + "\x18"; //Emphasized + Double-height mode selected (ESC ! (16 + 8)) 24 dec => 18 hex
cmds += "# ITEMS SOLD 2";
cmds += esc + "!" + "\x00"; //Character font A selected (ESC ! 0)
cmds += newLine + newLine;
cmds += "11/03/13  19:53:17";
