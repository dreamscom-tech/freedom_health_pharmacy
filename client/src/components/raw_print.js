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
    const sale = v.sale_type;
    //functions
    const getDate = () => {
      let month =
        new Date(Date.now()).getMonth() + 1 < 10
          ? "0" + (new Date(Date.now()).getMonth() + 1)
          : new Date(Date.now()).getMonth() + 1;
      let date =
        new Date(Date.now()).getDate() < 10
          ? "0" + new Date(Date.now()).getDate()
          : new Date(Date.now()).getDate();

      let date_str =
        date + "/" + month + "/" + new Date(Date.now()).getFullYear();
      return date_str;
    };

    const getNameSpaces = (n, i) => {
      let name = n;
      let name_formatted;
      if (name.length === i) {
        name_formatted = name;
      }
      if (name.length > i) {
        name_formatted = name.substring(0, i - 2) + "..";
      }
      if (name.length < i) {
        name_formatted = name;
        let spaces = i - name.length;
        for (let i = 0; i < spaces; i++) {
          name_formatted = name_formatted + " ";
        }
      }
      return name_formatted + " ";
    };
    // `${customer ? `Customer:  ${customer}` : ""}`,
    //functions
    if (customer) {
      let data = [
        "------------------------------------------------",
        "                                                ",
        "FREEDOM HEALTH AND SUPPLIES LTD                 ",
        "Plot 7, Chegere Road Apac                       ",
        "P.O.Box 120 Apac                                ",
        "Tel: 0393 193 423                               ",
        "                                                ",
        "SALES RECEIPT                                   ",
        "                                                ",
        "Date: " + getDate() + "                                ",
        "                                                ",
        "------------------------------------------------",
        "Name                  Qty   Unit     Amount(Shs)",
      ];

      values.forEach((v, i) => {
        data.push(
          `${getNameSpaces(v.product_name, 21)}${getNameSpaces(
            v.qty,
            5
          )}${getNameSpaces(v.selling_unit, 8)}${getNameSpaces(
            (parseInt(v.product_price) * parseInt(v.qty)).toString(),
            10
          )}`
        );
      });
      let data_with_footer = [
        ...data,
        "------------------------------------------------",
        `Sale          ${getNameSpaces(sale, 10)}                       `,
        `Total         UGX: ${getNameSpaces(
          total_amount.toString(),
          8
        )}                    `,
        `Discount      UGX: ${getNameSpaces(
          discount.toString(),
          8
        )}                    `,
        `Paid          UGX: ${getNameSpaces(
          amount_paid.toString(),
          8
        )}                    `,
        "                                                ",
        `Customer: ${getNameSpaces(customer, 24)}             `,
        "                                                ",
        "Thank You                                       ",
        `Served By: ${getNameSpaces(
          user.user.user_first_name,
          19
        )}                 `,
        "Be Healthy, Be Happy                            ",
        "                                                ",
        "------------------------------------------------",
      ];
      // "\x1B" + "\x45" + "\x4d" + "\x20" + "\x34",

      // return data;
      return data_with_footer;
    } else {
      let data = [
        "------------------------------------------------",
        "                                                ",
        "FREEDOM HEALTH AND SUPPLIES LTD                 ",
        "Plot 7, Chegere Road Apac                       ",
        "P.O.Box 120 Apac                                ",
        "Tel: 0393 193 423                               ",
        "                                                ",
        "SALES RECEIPT                                   ",
        "                                                ",
        "Date: " + getDate() + "                                ",
        "                                                ",
        "------------------------------------------------",
        "Name                  Qty   Unit     Amount(Shs)",
      ];

      values.forEach((v, i) => {
        data.push(
          `${getNameSpaces(v.product_name, 21)}${getNameSpaces(
            v.qty,
            5
          )}${getNameSpaces(v.selling_unit, 8)}${getNameSpaces(
            (parseInt(v.product_price) * parseInt(v.qty)).toString(),
            10
          )}`
        );
      });
      let data_with_footer = [
        ...data,
        "------------------------------------------------",
        `Sale          ${getNameSpaces(sale, 10)}                       `,
        `Total         UGX: ${getNameSpaces(
          total_amount.toString(),
          8
        )}                    `,
        `Discount      UGX: ${getNameSpaces(
          discount.toString(),
          8
        )}                    `,
        `Paid          UGX: ${getNameSpaces(
          amount_paid.toString(),
          8
        )}                    `,
        "                                                ",
        "Thank You                                       ",
        `Served By: ${getNameSpaces(
          user.user.user_first_name,
          19
        )}                 `,
        "Be Healthy, Be Happy                            ",
        "                                                ",
        "------------------------------------------------",
      ];
      // "\x1B" + "\x45" + "\x4d" + "\x20" + "\x34",

      // return data;
      return data_with_footer;
    }
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
