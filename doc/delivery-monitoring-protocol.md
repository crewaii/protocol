# DMP / Delivery Monitoring Protocol

## TERMS
- `FRAGMENT`: the result of data partitioning.
- `TRANSPORT`: mechanism of fragmented data interchange that guarantees in-order delivering (examples: [TCP](https://tools.ietf.org/html/rfc793)).

## PROBLEM
  There are [`TRANSPORT`](#terms)s that can fall and in this case, does not provide information on which [`FRAGMENT`](#terms)s were delivered. This creates a problem after returning the ability to transfer [`FRAGMENT`](#terms)s: which [`FRAGMENT`](#terms)s should be resended?

## INTRODUCTION
  [`DMP`](#dmp--delivery-monitoring-protocol) has to be used with the [`TRANSPORT`](#terms) for tracking [`FRAGMENT`](#terms) delivery and, in case of the [`TRANSPORT`](#terms) failure, detecting undelivered [`FRAGMENT`](#terms)s. It solves [`PROBLEM`](#problem), and takes care of the efficient use of memory and the time required for recovery. The protocol is symmetric for the sending and receiving side.

## PROTOCOL DESCRIPTION
### SPECIAL FRAGMENTS
- `ACK`: does not contain any specific information (see: [`SENDING ACK`](#sending-ack-recommendation)), has to be sent only once after receiving an [`ACK`](#special-fragments) from the other side.
- `SYN`: contains [`PTR`](#data-structures) and [`CNT`](#data-structures), and has to be sent primarily after [`TRANSPORT`](#terms) restoration from both sides.
  
### DATA STRUCTURES
- `S[0]`, `S[1]`: two 'storages' of sent [`FRAGMENT`](#terms)s. (The 'storage' is only conditional. The main thing is that you should have access to the already sent [`FRAGMENT`](#terms)s, divided into two parts as the protocol requires.)
- `PTR`: a boolean pointer to which 'storage' the [`FRAGMENT`](#terms)s should be written.
- `FRS`: a boolean field, true for the one who sends an [`ACK`](#special-fragments) first.
- `CNT`: an unsigned integer counter of the received data [`FRAGMENT`](#terms)s.

### PROTOCOL STAGES
#### PREPARATION
  Before the start of the protocol both sides have to initialize the necessary data structures with default values (empty storages([`S[0]`](#data-structures), [`S[1]`](#data-structures)), [`PTR`](#data-structures)`= 0`, [`CNT`](#data-structures)`= 0`), decide which side sends an [`ACK`](#special-fragments) first and depending on this, initialize the value of the [`FRS`](#data-structures): true if the side sends the [`ACK`](#special-fragments) first, false otherwise.
  
  After it you can start sending [`FRAGMENT`](#terms)s by writing each [`FRAGMENT`](#terms) to the [`S[PTR]`](#data-structures) on the sender's side, and send the first [`ACK`](#special-fragments).

#### NORMAL MODE
  When side sends [`FRAGMENT`](#terms), it has to write a [`FRAGMENT`](#terms) to the [`S[PTR]`](#data-structures). When receiver side gets [`FRAGMENT`](#terms), it has to increment [`CNT`](#data-structures). When anyone gets [`ACK`](#special-fragments) it has to set [`CNT`](#data-structures)`= 0`, clear [`S[!PTR]`](#data-structures) and then send the [`ACK`](#special-fragments) back and at the same time negate the [`PTR`](#data-structures).

#### RESTORE MODE
  If the [`TRANSPORT`](#terms) has failed, after its restoration both sides have to sent [`SYN`](#special-fragments). Then each ha count the value of ([`PTR`](#data-structures)<sub>local</sub> ⊕ [`PTR`](#data-structures)<sub>remote</sub> ⊕ [`FRS`](#data-structures)<sub>local</sub>). If this value is true, [`FRAGMENT`](#terms)s from [`S[PTR]`](#data-structures) starting from remote [`CNT`](#data-structures), else [`FRAGMENT`](#terms)s from [`S[!PTR]`](#data-structures) starting from [`CNT`](#data-structures)<sub>remote</sub> and all [`FRAGMENT`](#terms)s from [`S[PTR]`](#data-structures) were not delivered.
  
  To restore sending [`FRAGMENT`](#terms)s, each side has to resend all of the undelivered [`FRAGMENT`](#terms). Side can start sending new [`FRAGMENT`](#terms)s and as soon as re-send all of the undelivered [`FRAGMENT`](#terms)s from your side.

### SENDING [`ACK`](#data-structures) (recommendation)
  An [`ACK`](#special-fragments) has to be send only once after receiving an [`ACK`](#special-fragments) from the other side. This is the only rule about when the side should send an [`ACK`](#special-fragments). In turn, we want to offer our recommendation on this issue. In most [`TRANSPORT`](#terms) implementations: it will be critical for you how much memory is occupied by [`S[0]`](#data-structures), [`S[1]`](#data-structures), [`FRAGMENT`](#terms)s will be sent with a different time interval.
