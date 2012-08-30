#!/usr/bin/env perl
#
# The first argument should be the severity
#   @ARGV[0] should equal STRUCTURE | HELPER | FLUFF
use strict;
use HTML::Lint;

if (@ARGV <= 1) { die("You must provide a file to lint.\n"); }

my $linter = HTML::Lint->new;
my $severity = @ARGV[0];
my $numerrors = 0;

if ($severity eq 'STRUCTURE') {
    $linter->only_types(HTML::Lint::Error::STRUCTURE);
} elsif ($severity eq 'HELPER') {
    $linter->only_types(HTML::Lint::Error::STRUCTURE,
                        HTML::Lint::Error::HELPER);
} elsif ($severity eq 'FLUFF') {
    $linter->only_types(HTML::Lint::Error::STRUCTURE,
                        HTML::Lint::Error::HELPER,
                        HTML::Lint::Error::FLUFF);
}

foreach my $arg (@ARGV) {
    next if ($arg eq @ARGV[0]);

    $linter->parse_file($arg) or die("Cannot lint file: ", $arg, "\n");

    if ($linter->errors > 0) {
        $numerrors += scalar($linter->errors);

        foreach my $error ($linter->errors) {
            print $arg, ": ", $error->errtext(), " at ", $error->where(), "\n";
        }
    } else {
        print $arg, " ok.\n";
    }
}

if($numerrors > 0) {
    print "-----------------\n";
    print "Total Errors: ", $numerrors, "\n";
    exit 1;
} else {
    print "-----------------\n";
    print "No errors found.\n";
    exit 0;
}