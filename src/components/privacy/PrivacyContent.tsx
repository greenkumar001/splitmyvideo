
export default function PrivacyContent() {
  return (
    <main className="flex-1 bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            SplitMyVideo
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>

          <p className="mt-4 text-sm text-muted-foreground">
            Effective Date: November 26, 2026
          </p>

          <p className="mt-6 leading-7 text-muted-foreground">
            Your privacy matters to us. This Privacy Policy explains how
            SplitMyVideo, operated by Acustard Technologies, handles
            information when you use our video splitting and YouTube
            integration features.
          </p>
        </div>

        <div className="space-y-10">
          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              1. Information We Collect
            </h2>
            <p className="leading-7 text-muted-foreground">
              SplitMyVideo does not require users to create an account,
              register a profile, or maintain a permanent account with us.
              Video files selected for splitting are processed locally in
              your browser.
            </p>
            <p className="mt-3 leading-7 text-muted-foreground">
              When you connect your YouTube account, Google may provide
              authorization information and access tokens required to
              perform the YouTube actions you request.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              2. Video Processing and Storage
            </h2>
            <p className="leading-7 text-muted-foreground">
              Video splitting is performed directly in your browser using
              browser-based processing technology. Your original video is
              not uploaded to our servers for splitting.
            </p>
            <p className="mt-3 leading-7 text-muted-foreground">
              Generated clips may be stored locally in your browser using
              browser storage technologies, including the Origin Private
              File System (OPFS), to support downloading and uploading.
              These files remain on your device unless you choose to send
              a clip to another service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              3. YouTube and Google Account Integration
            </h2>
            <p className="leading-7 text-muted-foreground">
              SplitMyVideo allows you to connect your YouTube account using
              Google's authorization system. Connecting is optional and
              only happens when you choose to use the YouTube feature.
            </p>
            <p className="mt-3 leading-7 text-muted-foreground">
              We request YouTube upload authorization to allow you to
              upload a selected video clip to your own YouTube channel.
              You choose the clip and provide its title and description
              before initiating the upload.
            </p>
            <p className="mt-3 leading-7 text-muted-foreground">
              The selected clip and the information required for the
              upload are transmitted to Google/YouTube. Your video is
              subject to Google's and YouTube's policies and settings
              after upload.
            </p>
            <p className="mt-3 leading-7 text-muted-foreground">
              YouTube access tokens are kept in browser memory and are
              not stored in our application database. You may need to
              reconnect your account after refreshing the page or when
              authorization expires.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              4. Google User Data
            </h2>
            <p className="leading-7 text-muted-foreground">
              Our use and transfer of information received from Google
              APIs complies with the Google API Services User Data Policy,
              including its Limited Use requirements.
            </p>
            <p className="mt-3 leading-7 text-muted-foreground">
              We use YouTube authorization only to provide the upload
              functionality requested by you. We do not sell Google
              user data or use it for advertising.
            </p>
            <p className="mt-3 leading-7 text-muted-foreground">
              You can revoke SplitMyVideo's Google account access through
              your Google Account security settings.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              5. Data Sharing
            </h2>
            <p className="leading-7 text-muted-foreground">
              We do not sell or rent your personal information. When you
              explicitly choose to upload a clip, the selected video and
              required upload information are shared with Google/YouTube
              to complete that action.
            </p>
          </section>


          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              6. Data Security, Protection, Retention and Deletion
            </h2>

            <p className="leading-7 text-muted-foreground">
              SplitMyVideo uses reasonable technical and organizational
              measures to protect information handled through our
              application. Our website uses HTTPS to help protect
              information transmitted between your browser and our
              website. Requests made to Google and YouTube services
              use secure HTTPS connections.
            </p>

            <p className="mt-3 leading-7 text-muted-foreground">
              YouTube access tokens are held in browser memory and are
              not stored in our application database. This limits
              persistent storage of authorization credentials by
              SplitMyVideo. Tokens held in browser memory are cleared
              when the page is reloaded or the browser tab is closed.
              You may also revoke access through your Google Account
              security settings.
            </p>

            <p className="mt-3 leading-7 text-muted-foreground">
              We use Google authorization information only to provide
              the YouTube upload feature that you choose to use.
              We do not sell Google user data, use it for advertising,
              or disclose it to third parties except as necessary to
              provide the requested functionality, comply with law,
              or protect our services.
            </p>

            <p className="mt-3 leading-7 text-muted-foreground">
              Original video files are processed locally in your
              browser. Generated clips may remain in your browser's
              local storage, including OPFS, until you delete them
              using the available application controls or your browser
              removes that storage. You can clear locally stored clips
              through the app's storage controls or by clearing the
              site's browser data.
            </p>

            <p className="mt-3 leading-7 text-muted-foreground">
              SplitMyVideo does not maintain a permanent server-side
              library of your original videos or generated clips.
              We do not retain YouTube access tokens in a permanent
              application database. When you revoke Google access,
              we no longer use that authorization to perform YouTube
              actions.
            </p>

            <p className="mt-3 leading-7 text-muted-foreground">
              No method of electronic transmission or storage is
              completely secure. We take reasonable steps to protect
              information, but we cannot guarantee absolute security.
            </p>
          </section>


          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              7. Third-Party Services
            </h2>
            <p className="leading-7 text-muted-foreground">
              YouTube and Google services are governed by their own privacy
              policies and terms. We encourage you to review Google's
              Privacy Policy and YouTube's Terms of Service before using
              the integration.
            </p>
            <p className="mt-3">
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4"
              >
                Google Privacy Policy
              </a>
            </p>
            <p className="mt-2">
              <a
                href="https://www.youtube.com/t/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4"
              >
                YouTube Terms of Service
              </a>
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              8. Your Choices
            </h2>
            <p className="leading-7 text-muted-foreground">
              You can choose not to connect YouTube, decide which clips
              to upload, remove locally stored clips using the available
              app or browser controls, and revoke Google authorization
              through your Google Account settings.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              9. Children's Privacy
            </h2>
            <p className="leading-7 text-muted-foreground">
              SplitMyVideo is not designed to knowingly collect personal
              information from children. If you believe a child has
              provided personal information to us, please contact us.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              10. Changes to This Policy
            </h2>
            <p className="leading-7 text-muted-foreground">
              We may update this Privacy Policy when our services or
              privacy practices change. Updates will be published on
              this page with a revised effective date.
            </p>
          </section>

          <section className="border-t border-border pt-8">
            <h2 className="mb-3 text-2xl font-semibold">
              11. Contact Us
            </h2>
            <p className="leading-7 text-muted-foreground">
              If you have questions about this Privacy Policy or how
              SplitMyVideo handles information, please contact
              Acustard Technologies through our official website.
            </p>
            <a
              href="https://www.acustardtechnologies.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-primary underline underline-offset-4"
            >
              Acustard Technologies
            </a>
          </section>
        </div>

        <p className="text-xs text-gray-500">
          © 2026 Acustard Technologies. All rights reserved.
        </p>
      </div>
    </main>
  );
}
