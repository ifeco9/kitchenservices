'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function DebugAuthPage() {
    const [status, setStatus] = useState<any>({
        envCheck: 'Checking...',
        connection: 'Checking...',
        details: null,
        error: null
    });

    useEffect(() => {
        async function checkConnection() {
            const result: any = {};

            // 1. Check Env Vars (safely)
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

            result.envCheck = {
                urlPresent: !!url,
                urlValue: url ? `${url.substring(0, 15)}...` : 'MISSING',
                keyPresent: !!key,
                keyLength: key ? key.length : 0
            };

            // 2. Check Connection
            try {
                console.log('Attempting Supabase fetch...');
                const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });

                if (error) {
                    throw error;
                }

                result.connection = 'SUCCESS';
                result.details = 'Connected to Supabase successfully.';
            } catch (err: any) {
                console.error('Debug fetch error:', err);
                result.connection = 'FAILED';
                result.error = err.message || JSON.stringify(err);

                // Try raw fetch to debug network in browser
                try {
                    if (url && key) {
                        const res = await fetch(`${url}/rest/v1/`, { headers: { apikey: key } });
                        result.rawFetch = {
                            status: res.status,
                            ok: res.ok
                        };
                    }
                } catch (rawErr: any) {
                    result.rawFetchError = rawErr.message;
                }
            }

            setStatus(result);
        }

        checkConnection();
    }, []);

    return (
        <div className="p-8 font-mono text-sm">
            <h1 className="text-xl font-bold mb-4">Auth Debugger</h1>

            <div className="space-y-4">
                <div className="p-4 border rounded bg-gray-50">
                    <h2 className="font-bold mb-2">Environment Variables</h2>
                    <pre>{JSON.stringify(status.envCheck, null, 2)}</pre>
                </div>

                <div className={`p-4 border rounded ${status.connection === 'SUCCESS' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <h2 className="font-bold mb-2">Supabase Connection</h2>
                    <div className="text-lg font-bold">{status.connection}</div>
                    {status.error && (
                        <div className="mt-2 text-red-600">
                            Error: {status.error}
                        </div>
                    )}
                    {status.rawFetchError && (
                        <div className="mt-2 text-red-600">
                            Raw Fetch Error: {status.rawFetchError}
                        </div>
                    )}
                    {status.rawFetch && (
                        <div className="mt-2">
                            Raw Fetch Status: {status.rawFetch.status} (OK: {String(status.rawFetch.ok)})
                        </div>
                    )}
                </div>

                <div className="mt-4">
                    <p>If Environment Variables are MISSING, please restart the server.</p>
                    <p>If Connection is FAILED but Env Vars are present, check the Browser Console (F12) Network Tab.</p>
                </div>
            </div>
        </div>
    );
}
