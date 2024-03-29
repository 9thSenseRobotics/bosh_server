<?php
/* Jaxl (Jabber XMPP Library)
 *
 * Copyright (c) 2009-2010, Abhinav Singh <me@abhinavsingh.com>.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 *   * Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *
 *   * Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in
 *     the documentation and/or other materials provided with the
 *     distribution.
 *
 *   * Neither the name of Abhinav Singh nor the names of his
 *     contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
 * FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRIC
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
    
    class JAXLog {
        
        private static function writeLog($logPath, $log) {
            $fh = fopen($logPath, "a");
            fwrite($fh, $log."\n\n");
            fclose($fh);
        }

        public static function log($log, $level=1, $jaxl=false) {
            $log = '['.$jaxl->pid.'] '.date('Y-m-d H:i:s')." - ".$log;
            
            if($level == 0) {
                if($jaxl->mode == "cli")
                    print $log."\n";
            }
            else {
                if($level <= $jaxl->logLevel)
                    self::writeLog($jaxl->logPath, $log);
            }

            return true;
        }

        public static function logRotate($jaxl) {
            if(copy($jaxl->logPath, $jaxl->logPath.'.'.date('Y-m-d-H-i-s')))
                if($jaxl->mode == 'cli')
                    print '['.$jaxl->pid.'] '.date('Y-m-d H:i:s')." - Successfully rotated log file...\n";
            
            $fh = fopen($jaxl->logPath, "r+");
            ftruncate($fh, 1);
            rewind($fh);
            fclose($fh);
        }

    }
    
?>
