package com.example.a.lab_4_android;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class APIActivity extends AppCompatActivity {

    TextView transTextView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_api);
        transTextView = (TextView) findViewById(R.id.result);
    }

    public void translate(View V){

        TextView textView = (TextView) findViewById(R.id.text);
        String text = textView.getText().toString();
        String getURL = "https://translate.yandex.net/api/v1.5/tr.json/translate?" +
                "key=trnsl.1.1.20151023T145251Z.bf1ca7097253ff7e." +
                "c0b0a88bea31ba51f72504cc0cc42cf891ed90d2&text=" + text +"&" +
                "lang=en-es&[format=plain]&[options=1]&[callback=set]";//The API service URL

        String G_API_KEY = "AIzaSyCkfleD2A-9zHcVW8BS_wluHRP34jwJYys";
        String gTransUrl = "https://translation.googleapis.com/language/translate/v2?"+
                            "q=" + text + "&" +
                            "target=" + "fr" + "&" +
                            "key=" + G_API_KEY;
        OkHttpClient client = new OkHttpClient();
        try {
            Request request = new Request.Builder()
                    .url(gTransUrl)
                    .build();
            client.newCall(request).enqueue(new Callback() {
                @Override
                public void onFailure(Call call, IOException e) {
                    System.out.println(e.getMessage());
                }
                @Override
                public void onResponse(Call call, Response response) throws IOException {
                    final JSONObject jsonResult;
                    Log.d("header", response.toString());
                    final String result = response.body().string();
                    try {
                        jsonResult = new JSONObject(result);
                        final String convertedText = jsonResult.getJSONObject("data")
                                            .getJSONArray("translations").getJSONObject(0)
                                            .getString("translatedText");
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                transTextView.setText(convertedText);
                            }
                        });
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            });


        } catch (Exception ex) {
            transTextView.setText(ex.getMessage());
        }
    }
    public void logout(View V) {
        //This code redirects the from login page to the home page.
        Intent redirect = new Intent(APIActivity.this, MainActivity.class);
        startActivity(redirect);
    }

}
