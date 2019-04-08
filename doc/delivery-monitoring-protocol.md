# DMP / Delivery Monitoring Protocol

## TERMS
- `FRAGMENT`: the result of data partitioning.
- `TRANSPORT`: mechanism of fragmented data interchange that guarantees in-order delivery (examples: [TCP](https://tools.ietf.org/html/rfc793)).

## PROBLEM
  There are [`TRANSPORT`](#terms)s that can fall and in this case, does not provide information on which [`FRAGMENT`](#terms)s were delivered. This creates a problem after restoring the [`TRANSPORT`](#terms): which [`FRAGMENT`](#terms)s should be re-send?

## INTRODUCTION
  [`DMP`](#dmp--delivery-monitoring-protocol) have to be used with the [`TRANSPORT`](#terms) for tracking [`FRAGMENT`](#terms) delivery and, in case of the [`TRANSPORT`](#terms) failure, detecting undelivered [`FRAGMENT`](#terms)s. It solves [`PROBLEM`](#problem), and takes care of the efficient use of your memory and the time required for recovery. The protocol is symmetric for the sending and receiving side.

## PROTOCOL DESCRIPTION
### SPECIAL FRAGMENTS
- `ACK`: does not contain any specified information (see: [`SENDING ACK`](#sending-ack-recommendation)), have to be send only once after receiving an [`ACK`](#special-fragments) from the other side.
- `SYN`: contains [`PTR`](#data-structures) and [`CNT`](#data-structures), and have to be sent primarily after [`TRANSPORT`](#terms) restoration from both sides.
  
### DATA STRUCTURES
- `S[0]`, `S[1]`: two 'storages' of sent [`FRAGMENT`](#terms)s. (You should understand that the 'storage' is only conditional. The main thing is that you should have access to the already sent [`FRAGMENT`](#terms)s, divided into two parts as the algorithm requires.)
- `PTR`: a boolean pointer to which storage we should write to.
- `FRS`: a boolean field, true for the one who sends an [`ACK`](#special-fragments) first.
- `CNT`: the unsigned integer counter of the received data [`FRAGMENT`](#terms)s.

### PROTOCOL STAGES
#### PREPARATION
  Before the start of the protocol you have to initialize the necessary data structures with default values (empty storages([`S[0]`](#data-structures), [`S[1]`](#data-structures)), [`PTR`](#data-structures)`= 0`, [`CNT`](#data-structures)`= 0`), decide which side sends an [`ACK`](#special-fragments) first and depending on this, initialize the value of the [`FRS`](#data-structures): true if the side sends the [`ACK`](#special-fragments) first, false otherwise. After it you can start sending [`FRAGMENT`](#terms)s by writing each [`FRAGMENT`](#terms) to the [`S[PTR]`](#data-structures) on the sender's side, and send the first [`ACK`](#special-fragments).

#### NORMAL MODE
  When you send [`FRAGMENT`](#terms), you have to write a [`FRAGMENT`](#terms) to the [`S[PTR]`](#data-structures) on the sender's side. When you get [`FRAGMENT`](#terms) from the other side, you have to increment your [`CNT`](#data-structures). When you get [`ACK`](#special-fragments) you have to set [`CNT`](#data-structures)`= 0`, clear [`S[!PTR]`](#data-structures) and then send the [`ACK`](#special-fragments) back and at the same time negate the [`PTR`](#data-structures).

#### RESTORE MODE
  If the [`TRANSPORT`](#terms) has failed, after its restoration both sides have to sent [`SYN`](#special-fragments). Then you must count the value of ([`PTR`](#data-structures)<sub>local</sub> ⊕ [`PTR`](#data-structures)<sub>remote</sub> ⊕ [`FRS`](#data-structures)<sub>local</sub>). If this value is true, [`FRAGMENT`](#terms)s from [`S[PTR]`](#data-structures) starting from remote [`CNT`](#data-structures), else [`FRAGMENT`](#terms)s from [`S[!PTR]`](#data-structures) starting from [`CNT`](#data-structures)<sub>remote</sub> and all [`FRAGMENT`](#terms)s from [`S[PTR]`](#data-structures) were not delivered. If you want to restore sending [`FRAGMENT`](#terms)s, you can start sending new [`FRAGMENT`](#terms)s as soon as you re-send all of the undelivered [`FRAGMENT`](#terms)s from your side.

### SENDING [`ACK`](#data-structures) (recommendation)
  An [`ACK`](#special-fragments) have to be send only once after receiving an [`ACK`](#special-fragments) from the other side. This is the only rule about when you should send an [`ACK`](#special-fragments). In turn, we want to offer our recommendation on this issue. In most [`TRANSPORT`](#terms) implementations: it will be critical for you how much memory is occupied by [`S[0]`](#data-structures), [`S[1]`](#data-structures), [`FRAGMENT`](#terms)s will be sent with a different time interval.