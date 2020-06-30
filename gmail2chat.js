/* Credit: gist.github.com/andrewmwilson */
// You will also need to create a gmail filter to add the 'send-to-slack' label
// to any emails you want sent to chat

function main(){
  sendEmailsToSns();
}

function sendLine(token, message){
  // line group
  //var token = "jwTkRwHUmNcXXXXXXXXXXXXXXXX";
  var options = {
    "method"  : "post",
    "payload" : "message=" + message,
    "headers" : {"Authorization" : "Bearer "+ token}
  };
  UrlFetchApp.fetch("https://notify-api.line.me/api/notify",options);
}

function sendMsTeams(subject, body, msgdate){
  var url = "https://outlook.office.com/webhook/XXXXXXXX-4773-8996-fd651d0c9051@e72dfa00-7779-4fec-XXXXXXXXX/IncomingWebhook/";
  if(subject.indexOf('WAPI') > -1){
    url += "d9db2797a91c47c083XXXXXXXXXX-c7f3-479e-b3d9-XXXXXXXX";
  }
  else if(subject.indexOf('BAI10') > -1){
    url += "5b1c547f4a6d42a995XXXXXX/92641dea-c7f3-479e-b3d9-XXXXXX";
  } else {
    url += "4d31f2b2027fXXXXXX/92641dea-c7f3-479e-b3d9-XXXXXXX5";
  }

  var options = {
    'method' : 'post',
    'contentType' : 'application/json; charset=utf-8',
    'payload' : JSON.stringify({
      'title': subject,
      'text' : "DATE: " + msgdate + "\\nMSG: " + body
    })
  };
  UrlFetchApp.fetch(url, options);
  
  /*  
  if [ "$status" == 'OK' ]; then
  title=${status}
  elif [ "$status" == 'PROBLEM' ]; then
  title=${status}
  else
    emoji=':ghost:'
    fi
    
  attachment="
  {
    \"title\":\"ステータス : ${title}\",
    \"fallback\":\"${title}\n$3\",
    \"text\":\"ホスト名 : $2 \n
    トリガー名 : $3 \n 
    内容 : $4 \n
    DNS名 : $5 \n
    説明 : $6\",
    \"mrkdwn_in\": [\"text\", \"title\", \"fallback\"]
  }"
  curl -H "Content-Type: application/json" -d "${attachment}" https://outlook.office.com/webhook/3d7ad436-00ee-4620-b0XXXXXXXXX@e72dfa00-7779-4fec-XXXXXX/IncomingWebhook/d23614836dda4dXXXXXXX/40ef1c2e-7b38-4c3f-b479XXXXXX
  */
}


function sendEmailsToSns() {
  /*
  var label = GmailApp.getUserLabelByName("Delete Me");
  if(label == null){
    GmailApp.createLabel('Delete Me');
  }
  */

  var messages = [];
  var threads;

  var label = GmailApp.getUserLabelByName('zabbix');
  threads = label.getThreads();

  //threads = GmailApp.search('label:zabbix is:unread');

  for (var i = 0; i < threads.length; i++) {
    messages = threads[i].getMessages();
    
    //threads[i].markRead();
    //threads[i].moveToTrash();
  
    var message = messages[messages.length-1];

    message.markRead();
    
    var subject = message.getSubject();
    var body = message.getPlainBody();
    var msgdate = message.getDate();
    
    var output = '*■' + subject + '*';
    //output += '\n*from:* ' + message.getFrom();
    //output += '\n*to:* ' + message.getTo();
    //output += '\n*cc:* ' + message.getCc();
    output += '\n _' + msgdate + '_';
    output += '\n```' + body + '```';
    //Logger.log(output);

    /*
    var attachments = JSON.stringify([
    {
    color: "#89CEEB", //インデント線の色
    //pretext: "", //その外のメッセージ
    //author_name: "author_name : sakaguchi",//インデント内に表示される著者名
    //author_link: "http://google.co.jp/",//そのリンク
    title: subject,//インデント内に表示されるタイトル
    //title_link: "https://zabbix.xxxx.info/",//そのリンク
    text: body //インデント内に表示されるテスト
    }
    ]);
    */
    
    //https://slackmojis.com/
    var icon_emoji = (subject.indexOf('OK') > -1) ? ':test02:' : ':test01:';

    var options = {
      'method' : 'post',
      'payload' : JSON.stringify({
        'username': 'Zabbix',
        'channel' : '#taitorice',
        'icon_emoji': icon_emoji,
        'text': output,
      })
    };
    //  'payload' : Utilities.jsonStringify(payload),

    //var webhookUrl = 'https://hooks.slack.com/services/T1U4LXXXX/B2HTXXXX/HaUXHB1XXXXXX';
    //UrlFetchApp.fetch(webhookUrl, options);
    
    /*
    sendMsTeams(subject, body, msgdate);
    */
    
    //if(subject.indexOf('db-') > 0 || subject.indexOf('BAI') > 0 || subject.indexOf('WAPI') > -1){
    if(subject.indexOf('WAPI') > -1){
      var token = "jwTkRwHUmNcurM42hQGX9XXXXXXX";
      sendLine(token, output);
    }
    
    if(subject.indexOf('BAI10') > -1){
      var token = "8BtrArTnhqgmz5SQZ9YGXXXXXX";
      sendLine(token, output);
    }
  
  }

  // remove the label from these threads so we don't send them to sns again next time the script is run
  label.removeFromThreads(threads);
  
}
