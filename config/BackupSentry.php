<?php

return [
    'backup' => [
        // The compressed file password, leave empty if the default value is same as env key : BACKUP_SENTRY_ZIP_PASSWORD
        'compressed_password' => '',
        // to backup the database tables
        'database' => [
            'allow' => true,
            'connection' => '',
            'host' => '',
            'port' => '',
            'name' => '',
            'username' => '',
            'password' => '',
        ],
        // upload backup file into cloud services 
        'cloud_services' => [
            'google_drive' => [
                'allow' => false,
                'folder_id' => '', // leave empty if the default value is same as env key : GOOGLE_DRIVE_BACKUP_FOLDER_ID
                'client_id' => '', // leave empty if the default value is same as env key : GOOGLE_DRIVE_CLIENT_ID
                'refresh_token' => '', // leave empty if the default value is same as env key : GOOGLE_DRIVE_REFRESH_TOKEN
                'client_secret' => '', // leave empty if the default value is same as env key : GOOGLE_DRIVE_CLIENT_SECRET
            ],
            'aws' => [
                'allow' => false,
                'access_key' => '', // leave empty if the default value is same as env key : AWS_ACCESS_KEY_ID
                'secret_key' => '', // leave empty if the default value is same as env key : AWS_SECRET_ACCESS_KEY
                'bucket_name' => '', // leave empty if the default value is same as env key : AWS_BUCKET
                'region' => '', // leave empty if the default value is same as env key : AWS_DEFAULT_REGION
            ]
        ],
        // Main email that will get emails about backup whatever it is success or failure 
        // [you could add cc on each type of emails in the options below]
        'mail' => [
            'allow' => true,
            'to' => ['abdelrahmansamirmostafa@gmail.com']
        ],
        // enable sending alert emails
        'email_alert' => true,
        'channels' => [
            // enable sending alert via slack channels
            'slack' => [
                'allow' => false,
                'webhook_url' => '' // you can create a new app on slack OR leave empty if the default value is same as env key : SLACK_WEBHOOK_URL
            ],
            // enable sending alert via telegram bots
            'telegram' => [
                'allow' => false,
                'bot_token' => '', // you can create a new bot on telegram OR leave empty if the default value is same as env key : TELEGRAM_BOT_TOKEN
                'chat_ids' => [] // array of chat ids of your users ** [Telegram not sending messages by phone number]
            ]
        ],
        // to backup the complete project files
        'full_project' => false,
        // to backup the storage folder only
        'storage_only' => true,
        // location of project storage
        'storage_path' => "storage/",
        // to backup specific folders or files
        'specific_folders_or_files' => [
            // 'tests',
            // '.env'
            // 'app/folder1',
            // 'app/file.txt',
        ],
        // to exclude specific files/folders
        'excludes' => [
            '.git',
            'vendor',
            'node_modules',
        ],
        // that's mean the original back up folders will be kept in "/storage/backup-sentry/files/" [Which will be kept uncompressed]
        'keep_original_backup_folders' => false,
        // cleanup
        'cleanup' => true
    ],
    'options' => [
        // put the emails to be alerted with the successful backup notification
        'alert_successful_backup_email_to' => [],
        // put the emails to be alerted with the failure backup notification
        'alert_failure_backup_email_to' => [],
        // encryption type for the compressed file
        'encryption' => 'EM_AES_256',
    ]
];
