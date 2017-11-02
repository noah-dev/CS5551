package com.example.rohithkumar.androidwearapplication;

import android.app.Activity;
import android.os.Bundle;
import android.os.StrictMode;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class MainActivity extends Activity {

    private TextView mTextView;
    private EditText key;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.round_activity_main);
        mTextView = (TextView) findViewById(R.id.textView_display);
        Button button = (Button) findViewById(R.id.button2);
        StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
        StrictMode.setThreadPolicy(policy);
    }

    public void weather(View v) {
        key = (EditText) findViewById(R.id.editext_cityname);
        String s = key.getText().toString();
        String z = s.replace(" ", "_");
        String result = "Error";
        String getURL = "https://api.fixer.io/latest?base=USD";
        String response = null;
        BufferedReader bfr = null;
        try {
            URL url = new URL(getURL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.connect();

            bfr = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder sb = new StringBuilder();
            String line = null;

            // Read Server Response
            Log.d("RESPONSE: ", bfr.toString());
            while ((line = bfr.readLine()) != null) {
                // Append server response in string
                sb.append(line + " ");
            }
            response = sb.toString();
            Log.d("RESPONSE: ", response);

        } catch (Exception ex) {
            //Toast.makeText(this, "weather button clicked exception", Toast.LENGTH_SHORT).show();
            String Error = ex.getMessage();
        } finally {
            try {
                bfr.close();
            } catch (Exception ex) {

            }
        }
        try {
            JSONObject asJson = new JSONObject(response);
            result = asJson.getJSONObject("rates").getString(s);
        } catch (JSONException e){
            Log.d("Error: ", e.toString());
        }
        mTextView.setText(result);
    }
}
