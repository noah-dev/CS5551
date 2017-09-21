package com.example.a.lab_4_android;

import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Button;

public class RegisterActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.actvity_register);
    }


    public void login(View V) {
        //This code redirects the from login page to the home page.
        Intent redirect = new Intent(RegisterActivity.this, APIActivity.class);
        startActivity(redirect);
    }

}
